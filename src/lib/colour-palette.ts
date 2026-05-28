/**
 * Ascend Colour Palette
 *
 * All colours used across the project. Reference these when adding new
 * components or editing existing ones to keep the brand consistent.
 *
 * Theme: near-black backgrounds, off-white text, chrome silver accents.
 */

export const colours = {
  /** Primary page/section background */
  background: "#0a0a0a",

  /** Alternate section background (slightly lighter, used on TheFramework & FinalCTA) */
  backgroundAlt: "#0d0d0d",

  /** Card/panel background */
  card: "#141414",

  /** Hover state on dark panels */
  cardHover: "#111111",
  cardHoverSubtle: "#0f0f0f",

  /** Primary body text — off-white */
  foreground: "#e8e8e3",

  /** Chrome silver — accent labels, divider lines, hover highlights */
  accent: "#c0c0c0",

  /** Muted body copy */
  muted: "#7a7a7a",

  /** Overline / eyebrow label text */
  overline: "#808080",

  /** Module number in TheFramework (faded, brightens on hover) */
  moduleNumber: "#303030",

  /** Border and grid-gap colour */
  border: "#2a2a2a",

  /** Divider between list items */
  divider: "#1e1e1e",

  /** CTA button: background */
  buttonBg: "#e8e8e3",

  /** CTA button: text */
  buttonText: "#0a0a0a",

  /** CTA button hover glow (rgba) */
  buttonGlow: "rgba(192,192,192,0.25)",
} as const;

export type ColourKey = keyof typeof colours;
