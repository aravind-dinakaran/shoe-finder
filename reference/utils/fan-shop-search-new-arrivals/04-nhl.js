(function asoFanShopNewArrivalSortNhl() {
    const LEAGUE = "nhl";
    const GUARD = "__asoFanShopNewArrivalSort_" + LEAGUE;
    const APPLYING = "__asoFanShopNewArrivalSortApplying";
    const ORDER_BY = "newArrival";

    // All NHL team PLP tiles + unique nicknames + fan-shop intent phrases.
    // Excluded nicknames: stars, blues, predators, lightning, hurricanes, canes,
    // ducks, flames, wild, kings, jets, panthers, rangers, sharks, flyers, knights,
    // red wings (Red Wing boots).
    const KEYWORDS = [
        "nhl jersey",
        "nhl jerseys",
        "nhl fan shop",
        "nhl apparel",
        "nhl hat",
        "nhl hats",
        "nhl merch",
        "anaheim ducks",
        "boston bruins",
        "bruins",
        "buffalo sabres",
        "buffalo sabers",
        "sabres",
        "sabers",
        "calgary flames",
        "carolina hurricanes",
        "chicago blackhawks",
        "blackhawks",
        "colorado avalanche",
        "avs",
        "columbus blue jackets",
        "dallas stars",
        "detroit red wings",
        "edmonton oilers",
        "oilers",
        "florida panthers",
        "los angeles kings",
        "la kings",
        "minnesota wild",
        "montreal canadiens",
        "habs",
        "nashville predators",
        "nashville preds",
        "preds",
        "new jersey devils",
        "nj devils",
        "new york islanders",
        "ny islanders",
        "islanders",
        "new york rangers",
        "ny rangers",
        "ottawa senators",
        "philadelphia flyers",
        "philly flyers",
        "pittsburgh penguins",
        "penguins",
        "san jose sharks",
        "sj sharks",
        "seattle kraken",
        "kraken",
        "st. louis blues",
        "saint louis blues",
        "stl blues",
        "tampa bay lightning",
        "tampa lightning",
        "toronto maple leafs",
        "maple leafs",
        "utah mammoth",
        "vancouver canucks",
        "canucks",
        "vegas golden knights",
        "vgk",
        "washington capitals",
        "winnipeg jets"
    ];

    if (window[GUARD]) {
        return;
    }
    window[GUARD] = true;

    const PHRASES = buildPhrases(KEYWORDS);

    function buildPhrases(keywords) {
        const phrases = [];
        const seen = {};

        keywords.forEach(function (keyword) {
            expand(normalize(keyword)).forEach(function (phrase) {
                if (phrase && !seen[phrase]) {
                    seen[phrase] = true;
                    phrases.push(phrase);
                }
            });
        });

        phrases.sort(function (a, b) {
            return b.length - a.length;
        });

        return phrases;
    }

    function normalize(value) {
        if (!value) {
            return "";
        }

        let text = String(value).replace(/\+/g, " ");

        try {
            text = decodeURIComponent(text);
        } catch (e) {
            // keep decode-failed text
        }

        return text
            .toLowerCase()
            .replace(/[\u2018\u2019\u0060]/g, "'")
            .replace(/\./g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function expand(normalized) {
        if (!normalized) {
            return [];
        }

        return [
            normalized,
            normalized.replace(/\s*&\s*/g, " and "),
            normalized.replace(/-/g, " "),
            normalized.replace(/-/g, "")
        ].map(function (variant) {
            return variant.replace(/\s+/g, " ").trim();
        });
    }

    function escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function hasPhrase(haystack, needle) {
        return new RegExp("(?:^|[^a-z0-9])" + escapeRegex(needle) + "(?:[^a-z0-9]|$)", "i").test(haystack);
    }

    function matchesSearchTerm(term) {
        const haystacks = expand(normalize(term));
        let i;
        let j;

        for (i = 0; i < haystacks.length; i += 1) {
            for (j = 0; j < PHRASES.length; j += 1) {
                if (hasPhrase(haystacks[i], PHRASES[j])) {
                    return true;
                }
            }
        }

        return false;
    }

    function isSearchPath(pathname) {
        return pathname === "/search" || pathname === "/search/";
    }

    function findParam(params, name) {
        const target = name.toLowerCase();
        let match = null;

        params.forEach(function (value, key) {
            if (match === null && String(key).toLowerCase() === target) {
                match = { value: value };
            }
        });

        return match;
    }

    function withOrderBy(urlArg) {
        if (typeof urlArg !== "string" || !urlArg) {
            return urlArg;
        }

        let url;
        try {
            url = new URL(urlArg, location.origin);
        } catch (e) {
            return urlArg;
        }

        if (!isSearchPath(url.pathname) || findParam(url.searchParams, "orderBy") || !matchesSearchTerm((findParam(url.searchParams, "searchTerm") || {}).value || "")) {
            return urlArg;
        }

        const joiner = url.search && url.search !== "?" ? "&" : "?";
        const nextPath = url.pathname + (url.search || "") + joiner + "orderBy=" + ORDER_BY + url.hash;
        const isRelative = !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(urlArg);

        return isRelative ? nextPath : url.origin + nextPath;
    }

    function currentLocation() {
        return location.pathname + location.search + location.hash;
    }

    function applyCurrentUrl(hardReplace) {
        const current = currentLocation();
        const next = withOrderBy(current);

        if (next === current) {
            return false;
        }

        if (hardReplace) {
            location.replace(location.origin + next);
            return true;
        }

        window[APPLYING] = true;
        history.replaceState(history.state, "", next);
        window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
        window[APPLYING] = false;
        return true;
    }

    function wrapHistory() {
        ["pushState", "replaceState"].forEach(function (method) {
            const original = history[method];

            if (typeof original !== "function") {
                return;
            }

            history[method] = function (state, title, url) {
                if (typeof url === "string" && url) {
                    url = withOrderBy(url);
                }

                return original.call(this, state, title, url);
            };
        });
    }

    wrapHistory();

    window.addEventListener("popstate", function () {
        if (window[APPLYING]) {
            return;
        }

        applyCurrentUrl(false);
    });

    if (isSearchPath(location.pathname)) {
        applyCurrentUrl(document.readyState === "loading");
    }
})();
