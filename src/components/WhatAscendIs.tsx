const pillars = [
  { label: "Mindset", description: "Rewire how you think before you act." },
  { label: "Leverage", description: "Use time, money, and systems to multiply output." },
  { label: "Systems", description: "Build machines that work while you sleep." },
  { label: "Attention", description: "Control what you focus on — control your results." },
  { label: "Discipline", description: "Do the work even when motivation is absent." },
  { label: "Ambition", description: "Operate with intent toward something bigger." },
];

export default function WhatAscendIs() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
            What It Is
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight">
            Not a course. Not a podcast. A private operator community.
          </h2>
          <div className="chrome-line w-16 mx-auto mt-8" aria-hidden="true" />
        </div>

        <p className="text-[#7a7a7a] text-base sm:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-16">
          Ascend is built for people who are done consuming content and ready to
          execute. Inside you&apos;ll find frameworks, accountability, and a network of
          operators who think at a different level.
        </p>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2a2a2a]">
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className="bg-[#0a0a0a] p-8 flex flex-col gap-3 hover:bg-[#111111] transition-colors duration-200"
            >
              <span className="text-[#c0c0c0] text-xs tracking-[0.3em] uppercase font-medium">
                {pillar.label}
              </span>
              <p className="text-[#7a7a7a] text-sm leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
