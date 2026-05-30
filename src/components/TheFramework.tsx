const modules = [
  {
    number: "01",
    title: "The Trap",
    description:
      "Understand the systems keeping most people stuck — mediocrity disguised as safety. Identify the patterns and break free.",
  },
  {
    number: "02",
    title: "Leverage",
    description:
      "Capital, code, media, and people. Learn to multiply your time and effort using the four levers that separate operators from employees.",
  },
  {
    number: "03",
    title: "Identity",
    description:
      "You can't outperform your self-image. Rebuild your identity around the operator you're becoming, not who you've been.",
  },
  {
    number: "04",
    title: "Attention & Influence",
    description:
      "Attention is currency. Master how to capture it, hold it, and convert it — in business and in life.",
  },
  {
    number: "05",
    title: "Building Systems",
    description:
      "Design workflows and automated processes that generate results without constant manual effort. Build once, compound forever.",
  },
  {
    number: "06",
    title: "Ascension",
    description:
      "The integration. Apply every module into a cohesive operating system for your life and business — then keep climbing.",
  },
];

export default function TheFramework() {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
            The Framework
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight">
            Six Modules. One Operating System.
          </h2>
          <div className="chrome-line w-16 mx-auto mt-8" aria-hidden="true" />
        </div>

        {/* Modules list */}
        <div className="flex flex-col divide-y divide-[#1e1e1e]">
          {modules.map((mod) => (
            <div
              key={mod.number}
              className="py-8 border-l-2 border-[#1e1e1e] pl-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 group transition-colors duration-300 hover:border-[#c0c0c0]"
            >
              <span className="text-[#1e1e1e] font-mono text-2xl font-bold shrink-0 group-hover:text-[#c0c0c0] transition-colors duration-300 w-12">
                {mod.number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#e8e8e3] font-semibold text-lg tracking-tight">
                  {mod.title}
                </h3>
                <p className="text-[#7a7a7a] text-sm leading-relaxed">
                  {mod.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
