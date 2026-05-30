const perks = [
  {
    title: "Private Discord",
    description:
      "Join a vetted, distraction-free server. No noise — only operators moving with intent.",
  },
  {
    title: "Deeper Breakdowns",
    description:
      "Exclusive deep-dives, walkthroughs, and analysis not available anywhere else.",
  },
  {
    title: "Systems Library",
    description:
      "Access a growing vault of templates, SOPs, and frameworks built by operators.",
  },
  {
    title: "Inner-Circle Networking",
    description:
      "Connect with people who are building, not just talking. Proximity matters.",
  },
];

export default function CommunityAccess() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
            Community
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight">
            The Network
          </h2>
          <div className="chrome-line w-16 mx-auto mt-8" aria-hidden="true" />
          <p className="mt-8 text-[#7a7a7a] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            This isn&apos;t a Discord server. It&apos;s a private network for people who operate differently.
          </p>
        </div>

        <div className="flex flex-col border-b border-[#1e1e1e]">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="group border-t border-[#1e1e1e] py-6 sm:py-7 flex items-start justify-between gap-6"
            >
              <div>
                <h3 className="text-[#e8e8e3] font-semibold tracking-tight text-base sm:text-lg">
                  {perk.title}
                </h3>
                <p className="mt-2 text-[#7a7a7a] text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="text-[#c0c0c0] text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ●
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
