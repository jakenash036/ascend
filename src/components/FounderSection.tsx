export default function FounderSection() {
  return (
    <section className="relative overflow-hidden py-24 px-6 bg-[#0d0d0d]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(192,192,192,0.04)_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
          The Founder
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight mb-10 max-w-3xl">
          Built by someone who refused to stay average.
        </h2>

        <div className="space-y-6">
          <p className="text-[#7a7a7a] text-sm leading-relaxed max-w-2xl">
            Ascend wasn&apos;t built from a classroom or a corporate desk. It was built from years of studying what actually separates people who operate at the highest level from everyone else.
          </p>
          <p className="text-[#7a7a7a] text-sm leading-relaxed max-w-2xl">
            The patterns were consistent — leverage, systems, identity, attention. Not hustle. Not luck. Mechanics. Ascend exists to teach those mechanics.
          </p>
          <p className="text-[#7a7a7a] text-sm leading-relaxed max-w-2xl">
            This community is for the people who feel the gap between where they are and where they know they could be — and are willing to close it.
          </p>
        </div>

        <p className="mt-10 text-[#c0c0c0] text-sm tracking-[0.3em] font-semibold">
          — Ascend
        </p>
      </div>
    </section>
  );
}
