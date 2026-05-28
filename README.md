# ascend
Ascend is a modern operator brand focused on leverage, systems, ambition and escaping average through scalable thinking, attention and disciplined execution.

---

## Design System

Before adding or editing any UI, check these three files to make sure your changes align with the established brand:

| File | What it covers |
|------|----------------|
| [`src/lib/colour-palette.ts`](src/lib/colour-palette.ts) | Every colour token used in the project — backgrounds, text, accents, borders, button states. |
| [`src/lib/font-stack.ts`](src/lib/font-stack.ts) | Font families, weights, letter-spacing values, and the full set of named text-role classes. |
| [`src/lib/editing-style.ts`](src/lib/editing-style.ts) | Visual patterns and rules: section layout, chrome divider lines, grid/card conventions, motion & hover behaviour, glow effects, CTA button style, and brand copy guidelines. |

These files are the single source of truth for the Ascend visual language. Hardcoded hex values or one-off Tailwind classes that diverge from these tokens should be replaced with the canonical values defined here.
