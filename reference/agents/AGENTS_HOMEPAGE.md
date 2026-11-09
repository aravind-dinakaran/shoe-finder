# AGENTS.md

## Coding standards

- Format: Plain HTML/CSS/JS snippet — no <html>/<body> tags. Deployed as a Contentstack CMS component.
- Framework: Bootstrap 5.1.3 (CSS via CDN already on host page; JS bundle added once inside the popup section for accordion support)
- Typography:
  - Fluid sizing formula to ensure all elements are responsive at all screen sizes: clamp(floor, Xvw, ceiling)
    - Width at which Desktop Figma is available: 1656px
    - Width at which Mobile Figma is available: 375px
    - The ceiling value within clamp formulas in mobile = ceiling value in desktop.
    - The floor value within clamp formula for mobile should be 8px
    - To find vw value:
      Desktop: (target*px / 1656) * 100  
      Mobile: (target*px / 375) * 100

## Assets and References

- All components' clickthrough links, values for the attribute "data-omni", alt text and aria labels are available within the tab "Week 16" in @reference/wk16/the-grid.xlsx .  
- The title svgs are present under @reference/wk16/svg/ 
- While building a new component in a file, always ensure that contents of @reference/template.html is used as the base.
- All the asset links are available under @reference/wk16/assets.txt

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