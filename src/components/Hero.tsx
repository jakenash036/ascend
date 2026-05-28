import CTAButton from "@/components/CTAButton";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(192,192,192,0.06)_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
        {/* Brand name */}
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium">
          Private Operator Community
        </p>

        <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-[#e8e8e3] leading-none">
          ASCEND
        </h1>

        {/* Chrome divider */}
        <div className="chrome-line w-24" aria-hidden="true" />

        <p className="text-2xl sm:text-3xl font-light tracking-widest uppercase text-[#c0c0c0]">
          Escape Average.
        </p>

        <p className="max-w-xl text-base sm:text-lg text-[#7a7a7a] leading-relaxed">
          Built for those who refuse to stay ordinary. Ascend is a private
          community where leverage, ambition, and systems converge — so you can
          operate at a level most people never reach.
        </p>

        <CTAButton className="mt-4" />
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent"
      />
    </section>
  );
}
