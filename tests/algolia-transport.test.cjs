const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(`${__dirname}/../shoe-finder.html`, 'utf8');
const transport = html.slice(html.indexOf('        async function queryAlgolia('), html.indexOf('        function getCookie('));
const lifecycle = html.slice(html.indexOf('        async function runAlgoliaSearch('), html.indexOf('        //  UI CONFIG'));

function harness(fetch) {
    const state = { answers: { surface: 'road' }, results: {} };
    const context = vm.createContext({
        ALGOLIA: { appId: 'TEST', apiKey: 'test-key' },
        window: { fetch }, AbortController, setTimeout, clearTimeout,
        console: { error() {}, warn() {} }, state,
        saveToSession() {}, renderStep() {}, sortHitsByStartDateDesc() {},
        searchWithFallbacks: async () => ({ res: { hits: [{ objectID: 'shoe' }], nbHits: 1 }, removed: [] }),
        enrichHitsWithLongDescriptionAndBenefits: async () => {},
    });
    vm.runInContext(transport + lifecycle, context);
    return context;
}

test('widget script parses', () => {
    for (const [, script] of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(script);
});

test('fetch preserves query parameters and authenticates both indexes', async () => {
    const calls = [];
    const context = harness(async (url, options) => {
        calls.push({ url, options });
        return { ok: true, json: async () => ({ hits: [], nbHits: 0 }) };
    });
    for (const index of ['inventory', 'products']) {
        await context.queryAlgolia(index, { filters: 'facet_Activity:"Running"', page: 0, hitsPerPage: 24 });
    }
    assert.equal(calls.length, 2);
    assert.match(calls[1].url, /\/indexes\/products\/query$/);
    assert.equal(calls[0].options.method, 'POST');
    assert.equal(calls[0].options.headers['X-Algolia-Application-Id'], 'TEST');
    assert.deepEqual(JSON.parse(calls[0].options.body), { query: '', filters: 'facet_Activity:"Running"', page: 0, hitsPerPage: 24 });
});

for (const [name, fetch] of [
    ['HTTP failure', async () => ({ ok: false, status: 503 })],
    ['network failure', async () => { throw new TypeError('Failed to fetch'); }],
    ['invalid JSON', async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } })],
    ['invalid response', async () => ({ ok: true, json: async () => ({ message: 'error' }) })],
]) {
    test(`${name} is not treated as zero matches`, async () => {
        const context = harness(fetch);
        await assert.rejects(() => context.queryAlgolia('inventory', {}));
        context.searchWithFallbacks = async () => ({ res: await context.queryAlgolia('inventory', {}) });
        await context.loadResults();
        assert.equal(context.state.results.error, true);
        assert.equal(context.state.results.loading, false);
    });
}

test('timeout aborts request and clears timer', async () => {
    let abort, cleared = false;
    const context = harness((url, { signal }) => new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('Aborted')));
    }));
    context.setTimeout = (fn, ms) => { assert.equal(ms, 15000); abort = fn; return 42; };
    context.clearTimeout = id => { assert.equal(id, 42); cleared = true; };
    const pending = context.queryAlgolia('inventory', {});
    abort();
    await assert.rejects(pending, /Aborted/);
    assert.equal(cleared, true);
});

test('retry clears error and preserves answers; enrichment failure preserves hits', async () => {
    const context = harness();
    const answers = context.state.answers;
    context.state.results.error = true;
    context.enrichHitsWithLongDescriptionAndBenefits = async () => { throw new Error('Details unavailable'); };
    await context.loadResults();
    assert.equal(context.state.results.error, false);
    assert.equal(context.state.results.loading, false);
    assert.equal(context.state.results.hits.length, 1);
    assert.equal(context.state.answers, answers);
});

test('successful zero matches remain a non-error result', async () => {
    const context = harness();
    context.searchWithFallbacks = async () => ({ res: { hits: [], nbHits: 0 }, removed: [] });
    await context.loadResults();
    assert.equal(context.state.results.error, false);
    assert.equal(context.state.results.nbHits, 0);
});

test('an older request cannot overwrite a newer result', async () => {
    const context = harness();
    let finishFirst;
    context.searchWithFallbacks = () => new Promise(resolve => { finishFirst = resolve; });
    const first = context.loadResults();
    context.searchWithFallbacks = async () => ({ res: { hits: [{ objectID: 'new' }], nbHits: 1 }, removed: [] });
    await context.loadResults();
    finishFirst({ res: { hits: [{ objectID: 'old' }], nbHits: 1 }, removed: [] });
    await first;
    assert.equal(context.state.results.hits[0].objectID, 'new');
});
