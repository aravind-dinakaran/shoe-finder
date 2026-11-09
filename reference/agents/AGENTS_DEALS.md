# AGENTS.md

## General Working Rules

### 1. Think Before Coding

- Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
- Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.
- When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.
- The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution
- Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Writ
- For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

## Steps to build bfd.html

- The page is built using plain HTML/CSS/JS and is deployed as a Contentstack CMS component.
- The goal is to preserve the structure of code in @reference/bfd.html but update the cards within it according to a new set of stories. Do not update the style.
- The image assets are present within @assets/bfd.txt.
- The values for clickthrough links, data-omni, aria-label and alt text are available within @reference/the-grid.xlsx. For the data-omni value, when a matching story is found within @reference/the-grid.xlsx , retrieve the data-omni value, separate the string using '_' and get the last 2 values and then form the value according to this: 'deal\_<value1>\_<value2>'
- Create a new file in the root folder of the current repository with name "bfd.html" and generate the new code according to the given Figma Mockup. If the Figma mockup is not given, ask the user for it. Use the Figma mockup just to know the order of the cards and the text within each card. 


## Steps to build deals-flyout.html

- The page is built using plain HTML/CSS/JS and is deployed as a Monetate component.
- The goal is to preserve the structure of code in @reference/deals-flyout.html but update the cards within it according to a new set of stories. Do not update the style.
- The image assets are present within @assets/deals-flyout.txt.
- The values for clickthrough links, data-omni, aria-label and alt text are available within @reference/the-grid.xlsx. For the data-omni value, when a matching story is found within @reference/the-grid.xlsx , retrieve the data-omni value, separate the string using '_' and get the last 2 values and then form the value according to this: 'df\_<value1>\_<value2>'
- Create a new file in the root folder of the current repository with name "deals-flyout.html" and generate the new code according to the given Figma Mockup. If the Figma mockup is not given, ask the user for it. Use the Figma mockup just to know the order of the cards.
