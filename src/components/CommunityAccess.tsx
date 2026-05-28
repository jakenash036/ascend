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
            Community Access
          </h2>
          <div className="chrome-line w-16 mx-auto mt-8" aria-hidden="true" />
          <p className="mt-8 text-[#7a7a7a] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Membership includes access to a Discord-based private community —
            built for operators who move with purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#2a2a2a]">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="bg-[#0a0a0a] p-8 hover:bg-[#0f0f0f] transition-colors duration-200"
            >
              <div className="flex items-start gap-3 mb-4">
                {/* Chrome accent dot */}
                <span
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full bg-[#c0c0c0]"
                />
                <h3 className="text-[#e8e8e3] font-semibold text-base tracking-tight">
                  {perk.title}
                </h3>
              </div>
              <p className="text-[#7a7a7a] text-sm leading-relaxed pl-4">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
