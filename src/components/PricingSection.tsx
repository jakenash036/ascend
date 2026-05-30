import CTAButton from "@/components/CTAButton";

interface PricingSectionProps {
  onJoin: () => void;
}

const plans = [
  {
    name: "Monthly",
    price: "£19.99",
    cadence: "/ mo",
    detail: "Billed monthly · Cancel anytime",
  },
  {
    name: "Yearly",
    price: "£179.99",
    cadence: "/ yr",
    detail: "Best value · Cancel anytime",
    badge: "Save 25%",
    highlighted: true,
  },
];

export default function PricingSection({ onJoin }: PricingSectionProps) {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
          Membership
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight">
          Simple Pricing. No Hidden Fees.
        </h2>
        <div className="chrome-line w-16 mx-auto mt-8" aria-hidden="true" />

        <p className="text-[#c0c0c0] text-xs tracking-[0.3em] uppercase text-center mb-8 mt-8">
          Founding member pricing — locked in for life.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 bg-[#141414] border ${
                plan.highlighted ? "border-[#c0c0c0]" : "border-[#2a2a2a]"
              }`}
            >
              {plan.badge ? (
                <span className="absolute top-4 right-4 text-[10px] tracking-[0.15em] uppercase bg-[#1e1e1e] border border-[#c0c0c0] text-[#c0c0c0] px-2 py-1">
                  {plan.badge}
                </span>
              ) : null}
              <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-4">
                {plan.name}
              </p>
              <p className="text-3xl font-semibold text-[#e8e8e3] tracking-tight">
                {plan.price}
              </p>
              <p className="text-sm text-[#c0c0c0] mb-3">{plan.cadence}</p>
              <p className="text-xs text-[#808080] tracking-wide">{plan.detail}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <CTAButton label="Join Ascend" onClick={onJoin} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[#404040] text-xs tracking-widest uppercase">
          <p>Private · Members Only</p>
          <p>Cancel Anytime</p>
          <p>Instant Discord Access</p>
        </div>
      </div>
    </section>
  );
}
