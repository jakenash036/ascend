import CTAButton from "@/components/CTAButton";

interface FinalCTAProps {
  onJoin: () => void;
}

export default function FinalCTA({ onJoin }: FinalCTAProps) {
  return (
    <section className="py-32 px-6 bg-[#0d0d0d] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(192,192,192,0.05)_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="chrome-line w-16" aria-hidden="true" />

        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#e8e8e3] leading-tight">
          The average life is crowded.
          <br />
          <span className="text-[#c0c0c0]">Yours doesn&apos;t have to be.</span>
        </h2>

        <p className="text-[#7a7a7a] text-base sm:text-lg leading-relaxed max-w-lg">
          Every day you wait is a day spent below your potential. Ascend is for
          operators who are ready to move — with leverage, systems, and
          relentless ambition.
        </p>

        <div className="relative mt-2 flex flex-col items-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -bottom-2 h-10 bg-[#c0c0c0]/10 blur-2xl animate-pulse"
          />
          <CTAButton className="relative z-10" onClick={onJoin} />
        </div>

        <div className="flex flex-col items-center gap-2 text-[#404040] text-xs tracking-widest uppercase">
          <p>Private · Members Only</p>
          <p>Cancel Anytime</p>
          <p>Instant Discord Access</p>
        </div>

        <p className="text-[#2a2a2a] text-xs tracking-[0.6em] uppercase">
          Ascend. Escape Average.
        </p>

        <div className="chrome-line w-16" aria-hidden="true" />
      </div>
    </section>
  );
}
