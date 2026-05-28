/**
 * Ascend Editing Style Guide
 *
 * Visual patterns and Tailwind class conventions used across every component.
 * Follow these rules when creating or editing UI to keep the brand sharp and consistent.
 */

/**
 * Layout & spacing
 * ─────────────────
 * - Full-bleed sections use `py-24 px-6` (standard) or `py-32 px-6` (hero/final CTA).
 * - Inner content is constrained with `max-w-4xl mx-auto` (most sections)
 *   or `max-w-3xl mx-auto` (hero) / `max-w-2xl mx-auto` (final CTA).
 * - Section headers follow the pattern: overline → h2 → chrome divider line.
 */
export const layout = {
  sectionPadding: "py-24 px-6",
  sectionPaddingLarge: "py-32 px-6",
  contentMaxWidth: "max-w-4xl mx-auto",
  contentMaxWidthNarrow: "max-w-2xl mx-auto",
} as const;

/**
 * Chrome divider line
 * ────────────────────
 * A 1 px horizontal shimmer used between sections and around CTAs.
 * CSS class defined in globals.css: `.chrome-line`
 * Usage: <div className="chrome-line w-16 mx-auto" aria-hidden="true" />
 * Common widths: w-16 (section headers), w-24 (hero), full-width (decorative).
 */
export const chromeLine = "chrome-line";

/**
 * Grid / card patterns
 * ─────────────────────
 * - Use `gap-px bg-[#2a2a2a]` on the grid wrapper to create hairline borders.
 * - Individual cells use `bg-[#0a0a0a]` so the parent border colour shows through.
 * - 3-column grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
 * - 2-column grid: `grid-cols-1 sm:grid-cols-2`
 */
export const gridPatterns = {
  hairlineBorder: "gap-px bg-[#2a2a2a]",
  cellBg: "bg-[#0a0a0a]",
  threeCol: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  twoCol: "grid-cols-1 sm:grid-cols-2",
} as const;

/**
 * Motion & interaction
 * ─────────────────────
 * - All transitions use `duration-200`.
 * - Hover: panels lighten slightly (`hover:bg-[#111111]` or `hover:bg-[#0f0f0f]`).
 * - Active state on CTA: `active:scale-[0.98]`.
 * - Module numbers fade from `#303030` → `#c0c0c0` on row hover.
 * - No border-radius on interactive elements (sharp edges = `rounded-none`).
 */
export const motion = {
  transition: "transition-colors duration-200",
  transitionAll: "transition-all duration-200",
  activeScale: "active:scale-[0.98]",
} as const;

/**
 * Glow / atmosphere effects
 * ──────────────────────────
 * - Hero section: radial glow at 60% × 40%, centred at 50% 30%, silver @ 6% opacity.
 * - Final CTA: radial glow at 50% × 50%, centred, silver @ 5% opacity.
 * - Bottom fade on hero: `bg-gradient-to-t from-[#0a0a0a] to-transparent h-32`.
 * - CTA button hover glow: `hover:shadow-[0_0_24px_rgba(192,192,192,0.25)]`.
 * All glow divs must carry `aria-hidden="true"` and `pointer-events-none`.
 */
export const atmosphere = {
  heroGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(192,192,192,0.06)_0%,transparent_70%)]",
  ctaGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(192,192,192,0.05)_0%,transparent_70%)]",
  bottomFade:
    "pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent",
} as const;

/**
 * CTA button
 * ───────────
 * Standard appearance: sharp rectangle, off-white fill, near-black text, all-caps.
 * Hover: pure white + silver glow. Active: slight scale-down.
 */
export const ctaButton =
  "inline-block px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white hover:shadow-[0_0_24px_rgba(192,192,192,0.25)] active:scale-[0.98]";

/**
 * Brand voice & copy rules (for content editing)
 * ────────────────────────────────────────────────
 * - Tone: direct, confident, aspirational — no fluff.
 * - Overlines (eyebrow labels) are always ALL CAPS, very wide tracking, muted grey.
 * - Taglines use Title Case or ALL CAPS with wide tracking.
 * - Body copy uses sentence case; keep lines short and scannable.
 * - Avoid passive voice. Favour verbs of action and agency.
 */
