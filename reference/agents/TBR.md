# Academy Workspace Instructions

## Monetate safety policy

These rules apply to every Monetate task performed from this workspace, whether through an API, MCP server, browser automation, or the Monetate user interface.

### Operating model

- Separate Monetate access into three capabilities:
  1. **Read access:** inspect metadata, experience configuration, usage, status, and reporting.
  2. **Controlled authoring:** create or update an explicitly requested draft, or edit an explicitly identified existing experience after the user has placed it in `PAUSED` status.
  3. **Live control:** activate, unpause, schedule, launch, pause, archive, delete, publish, or otherwise change customer-facing delivery.
- Codex may use read access and may perform controlled authoring only when the user explicitly requests the specific work.
- Live control is human-only. Codex must never activate, unpause, schedule, launch, pause, archive, delete, publish, or otherwise change the delivery status of a Monetate experience or customer-facing configuration.
- In particular, Codex must never pause an active experience. When an active experience needs an edit, ask the user to pause it. After the user pauses it, verify that its current status is `PAUSED`, edit that same experience, leave it paused, and ask the user to review and activate it again.
- Prefer a dedicated Monetate platform identity that has Experience Building or Action Building permission but no activation or live-control permission. Do not rely solely on prompt instructions when Monetate can enforce a restricted role.

### Read and reporting work

- Read-only inspection, comparison, analysis, and reporting are allowed.
- Codex may open, click through, and inspect the code and configuration of active, scheduled, paused, or draft experiences for debugging. Read-only debugging does not require creating a new experience or a draft copy.
- Opening an editor is allowed for inspection only. Do not type into fields, apply changes, save, or otherwise mutate an active or scheduled experience.
- While an experience remains active or scheduled, Codex may copy its code into the local workspace, diagnose it, test proposed changes outside Monetate, and prepare replacement code for review. Saving that code back to the experience must wait until the user pauses it and Codex verifies `PAUSED` status.
- Prefer a genuine Monetate Read-Only API User or a Reporting Only platform user.
- If a standard API credential is temporarily used, place it behind a server-side GET-only allowlist. Never expose a raw HTTP tool to Codex.
- Do not create, update, or delete datasets to obtain reporting information.
- Do not export or retain customer-level data, Monetate IDs, session streams, purchase-detail records, or other potentially identifying data unless the user explicitly authorizes the specific business need and approved storage location.
- Reports must use aggregate data by default. Never overwrite or delete an existing report.

### Experience authoring and paused-edit workflow

- Codex may create a new experience only when the user explicitly requests a new experience.
- A Codex-created experience must remain in `DRAFT` status. Verify the status after every authoring session.
- Do not create a duplicate or replacement experience merely to inspect or debug an existing experience. Inspect the existing experience read-only.
- Never edit or save changes to an `ACTIVE` or `SCHEDULED` experience. Ask the user to pause or otherwise remove it from live delivery first; Codex must not perform that status change.
- After the user says an experience has been paused, re-read and verify its exact ID, account, market, current status, and last-modified information. If it is not verifiably `PAUSED`, stop without editing.
- Once an explicitly identified experience is verifiably `PAUSED`, Codex may edit that same experience when the user explicitly requests the edit. A new experience or draft copy is not required.
- Keep paused-experience edits narrowly limited to the requested code or configuration. Do not change targeting, allocation, goals, variants, timing, shared components, or unrelated fields unless the user explicitly requests those specific changes.
- Before changing an existing draft or paused experience, re-read its ID, account, market, current status, last-modified information, WHO, WHAT, WHEN, WHY, variants, traffic allocation, goals, and referenced shared components.
- If the experience becomes active, scheduled, or otherwise live before a save, stop and do not save.
- After editing a paused experience, verify that it is still `PAUSED`. Never activate or unpause it. Provide the exact configuration changes, preview or QA instructions, unresolved assumptions, and a human activation checklist; then ask the user to activate it when satisfied.
- Do not change an existing draft unless the user identifies it as the intended object or it was created by Codex for the current task.
- Give every new draft a clear name and description containing its purpose, owner or ticket when supplied, and draft/POC status.
- After authoring a new draft, provide the experience ID or link, exact configuration summary, preview instructions, unresolved assumptions, and a human QA/activation checklist.
- If Monetate requires activation to test a target, dynamic value, or collaborative recommendation, stop and hand that step to the user. Codex must not perform a restricted live activation, even for a small audience, query parameter, IP address, or short duration.

### Custom variables

- First determine whether a platform-level custom-variable definition is actually required. Engine API context variables can often be passed without defining a new platform object.
- Create a custom variable only when the user explicitly requests it and confirms its purpose, name, allowed values, and source.
- Never place names, emails, loyalty IDs, customer IDs, offer codes, authentication data, or other personal or sensitive data in a custom variable.
- Do not alter or delete an existing variable. Check for naming collisions and existing experience usage first.
- For a POC, use an isolated test namespace approved by the user and synthetic values only.

### Recommendation strategies

- Monetate supplies recommendation algorithms; Codex creates a recommendation strategy that selects an available algorithm, context, filters, fallbacks, and catalog. Do not describe this as creating a new algorithm unless custom model development is truly in scope.
- Create a strategy only when the user explicitly requests it.
- Create a new **local** strategy by default. Never create a global strategy unless the user explicitly approves the cross-account impact.
- Never edit or delete an existing strategy without first checking every experience, action, slot, or Product Finder that uses it. Editing a strategy used by an active experience is prohibited.
- Do not upload, replace, or modify the product catalog, recommendations dataset, custom list, schema, inventory, price, or customer data as part of strategy creation.
- Record the selected catalog, base algorithm, context item, filters and AND/OR logic, exclusions, fallback strategy, number of products, and expected empty-result behavior.
- Preview the strategy with representative synthetic or non-sensitive inputs and report relevance issues, insufficient-result conditions, and catalog dependencies. Saving a strategy does not authorize using it in an active experience.

### API and browser controls

- Do not use undocumented Monetate internal endpoints or reverse-engineered write requests for authoring. Use documented APIs or the authorized Monetate interface.
- A read connector must allow only administrator-approved Monetate Metadata API GET routes. Block Data API, Engine event/reporting calls, authentication administration, and every POST, PUT, PATCH, and DELETE route unless a separately reviewed connector is created for one narrowly defined purpose.
- An authoring connector must expose named, narrowly scoped tools for explicitly requested draft work or verified paused-experience edits. It must not expose activation, unpausing, scheduling, pausing, archiving, deletion, API-user administration, dataset upload, catalog update, or generic/raw request tools.
- Treat redirects, unknown endpoints, missing status information, permission ambiguity, and validation failures as hard stops. Fail closed and do not retry through another endpoint or identity.

### Credentials and auditability

- Keep private keys and tokens in an approved secret manager or operating-system credential store. They must not appear in chat, source files, repositories, URLs, browser localStorage created by Codex, screenshots, or logs.
- Use the shortest practical token lifetime and separate credentials for read access and controlled authoring.
- Log only the timestamp, account/environment, approved operation, object ID, response status, and sanitized result. Do not log credentials, full response bodies, PII, or customer-level records.
- Preserve a before-and-after configuration summary for every draft or paused-experience mutation.
- Never claim that Codex activated, paused, or otherwise changed live delivery. After authoring, state explicitly that activation remains pending human review. Read-only status checks may report the status Monetate currently returns.

## Weekly Jira sync presentation preferences

- Use the approved editorial layout from `Weekly Sync Output/2026-08-05/weekly-sync-expanded-editorial-2026-08-05.pptx` as the visual reference for future weekly decks.
- Use a full-width summary slide without a screenshot, followed by workstream detail slides with concise text on the left and relevant screenshots on the right. Preserve the Academy header, blue rule, week label, slide number, top navigation and generous white space.
- Use enough slides to keep the presentation readable. Do not force the content into a three-slide limit or reduce the text to an uncomfortably small size.
- Include HPLPs, BFD/Deals Flyout, promo cards, disclaimers and rebates when they were genuinely worked during the reporting window. Exclude Homepage and New at Academy work unless the user changes the scope.
- Refer to HPLP work as `HPLPs`, not generic `destinations`.
- Treat Jira tickets as evidence, not as the presentation count. Deduplicate related or duplicate tickets and report distinct deliverables, offers, campaigns, or releases. Do not headline a raw ticket total unless the user explicitly requests it and the count has been verified.
- Slides and read-aloud talking points must focus on what the team did: scope, deliverables, dates, quantities, meaningful status and next steps. Do not explain why the work matters or restate business rationale unless the user explicitly asks for it.
- Write talking points as a natural, sufficiently detailed, word-for-word presentation script. Avoid process commentary, generic filler and phrases that explain how tickets were grouped or how the deck should be navigated.
 