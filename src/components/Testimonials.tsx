const testimonials = [
  {
    quote:
      "Ascend changed the way I think about leverage. Within 60 days of joining I restructured how I was spending my time entirely.",
    attribution: "J.M., UK",
  },
  {
    quote:
      "The framework is the clearest breakdown of how modern success actually works that I've ever come across. No fluff.",
    attribution: "R.T., Ireland",
  },
  {
    quote:
      "I've been in a dozen communities. This is the only one where every conversation is worth reading.",
    attribution: "K.A., Australia",
  },
  {
    quote:
      "The systems module alone was worth more than I paid for a full year. Genuinely changed how I operate.",
    attribution: "D.W., Canada",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
            Members
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight">
            What Operators Are Saying
          </h2>
          <div className="chrome-line w-16 mx-auto mt-8" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.attribution}
              className="bg-[#141414] border border-[#2a2a2a] p-8"
            >
              <p className="text-[#2a2a2a] text-4xl font-bold leading-none mb-4">&quot;</p>
              <p className="text-[#7a7a7a] text-sm leading-relaxed italic">
                {testimonial.quote}
              </p>
              <p className="text-[#c0c0c0] text-xs tracking-[0.3em] uppercase border-t border-[#1e1e1e] pt-4 mt-4">
                {testimonial.attribution}
              </p>
            </article>
          ))}
        </div>

        <p className="text-[#404040] text-xs tracking-[0.4em] uppercase mt-12 text-center">
          500+ operators. Growing daily.
        </p>
      </div>
    </section>
  );
}
