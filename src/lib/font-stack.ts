/**
 * Ascend Font Stack & Typography
 *
 * Typography tokens used throughout the project.
 * Reference these when adding new text styles to stay consistent.
 *
 * The project uses the system sans-serif stack — no external font is loaded,
 * keeping the page fast and render-blocking-free.
 */

/** System sans-serif stack — defined in globals.css */
export const fontFamily = {
  sans: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
  ].join(", "),

  /** Mono — used for module/step numbers (TheFramework) */
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

/** Font weights in use */
export const fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/**
 * Letter-spacing / tracking patterns.
 * Tailwind utility equivalents are listed in comments.
 */
export const tracking = {
  /** Section overlines / eyebrow labels — `tracking-[0.4em]` */
  overline: "0.4em",

  /** Pillar labels inside cards — `tracking-[0.3em]` */
  cardLabel: "0.3em",

  /** CTA button text — `tracking-widest` (~0.1em) */
  cta: "0.1em",

  /** Headings — `tracking-tight` (-0.025em) */
  heading: "-0.025em",
} as const;

/**
 * Common text-size / role pairings used across components.
 * Values are Tailwind class names for quick reference.
 */
export const textRoles = {
  /** Hero headline */
  heroHeading: "text-6xl sm:text-8xl font-bold tracking-tight",

  /** Section heading (h2) */
  sectionHeading: "text-3xl sm:text-4xl font-semibold tracking-tight",

  /** Final CTA heading */
  ctaHeading: "text-4xl sm:text-5xl font-bold tracking-tight",

  /** Overline / eyebrow (small all-caps label above a heading) */
  overline: "text-xs tracking-[0.4em] uppercase font-medium",

  /** Card label */
  cardLabel: "text-xs tracking-[0.3em] uppercase font-medium",

  /** Tagline / subtitle */
  tagline: "text-2xl sm:text-3xl font-light tracking-widest uppercase",

  /** Body copy */
  body: "text-base sm:text-lg leading-relaxed",

  /** Small body / description copy */
  bodySmall: "text-sm leading-relaxed",

  /** Module number (mono, fades to accent on hover) */
  moduleNumber: "font-mono text-2xl font-bold",
} as const;
