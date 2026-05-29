"use client";

import { useState, useEffect } from "react";

interface SubscriptionFlowProps {
  visible: boolean;
  onClose: () => void;
}

type Step = "hidden" | "animating" | "panel";

const VARIANT_ID = "56930326905210";
const MONTHLY_PLAN = "711948927354";
const YEARLY_PLAN = "711950795130";
const STORE_URL = "https://ascendescapeaverage.com";

export default function SubscriptionFlow({
  visible,
  onClose,
}: SubscriptionFlowProps) {
  const [step, setStep] = useState<Step>("hidden");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      setStep("animating");
      const timer = setTimeout(() => setStep("panel"), 1400);
      return () => clearTimeout(timer);
    } else {
      setStep("hidden");
      setErrors({});
    }
  }, [visible]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Invalid email address";
    if (!discord.trim()) next.discord = "Discord username is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleJoin = () => {
    if (!validate()) return;
    const planId = selectedPlan === "monthly" ? MONTHLY_PLAN : YEARLY_PLAN;
    const params = new URLSearchParams({
      selling_plan: planId,
      "attributes[discord]": discord,
      "attributes[name]": name,
      "attributes[email]": email,
      "attributes[plan]": selectedPlan,
    });
    window.location.href = `${STORE_URL}/cart/${VARIANT_ID}:1?${params.toString()}`;
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setDiscord("");
    setErrors({});
    setSelectedPlan("monthly");
    onClose();
  };

  if (step === "hidden") return null;

  return (
    <>
      {/* Ascend transport overlay — beam shoots up, floods screen, fades */}
      {step === "animating" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0) 0%, rgba(140,140,135,0.55) 20%, rgba(200,200,195,0.92) 40%, rgba(232,232,227,1) 58%, rgba(255,255,255,1) 70%, rgba(232,232,227,0.96) 85%, rgba(180,180,175,0.6) 100%)",
            animation: "ascend-transport 1400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        />
      )}

      {/* Subscription panel — slides in after aura */}
      {step === "panel" && (
        <section
          className="w-full bg-[#0a0a0a] border-y border-[#2a2a2a] py-16 px-6"
          style={{ animation: "fade-slide-in 400ms ease-out forwards" }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Header row */}
            <div className="flex items-start justify-between mb-12">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-2">
                  Join Ascend
                </p>
                <h2 className="text-2xl font-semibold text-[#e8e8e3] tracking-tight">
                  Choose your plan
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200 text-base leading-none mt-1"
              >
                ✕
              </button>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {/* Monthly card */}
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`text-left p-6 bg-[#141414] border transition-colors duration-200 ${
                  selectedPlan === "monthly"
                    ? "border-[#c0c0c0]"
                    : "border-[#2a2a2a] hover:border-[#404040]"
                }`}
              >
                <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-4">
                  Monthly
                </p>
                <p className="text-3xl font-bold text-[#e8e8e3] tracking-tight">
                  £19.99
                </p>
                <p className="text-sm text-[#c0c0c0] mb-3">/ mo</p>
                <p className="text-xs text-[#808080] tracking-wide">
                  Billed monthly · Cancel anytime
                </p>
              </button>

              {/* Yearly card */}
              <button
                type="button"
                onClick={() => setSelectedPlan("yearly")}
                className={`text-left p-6 bg-[#141414] border transition-colors duration-200 relative ${
                  selectedPlan === "yearly"
                    ? "border-[#c0c0c0]"
                    : "border-[#2a2a2a] hover:border-[#404040]"
                }`}
              >
                <span className="absolute top-4 right-4 text-[10px] tracking-[0.15em] uppercase bg-[#1e1e1e] border border-[#c0c0c0] text-[#c0c0c0] px-2 py-1">
                  Save 25%
                </span>
                <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-4">
                  Yearly
                </p>
                <p className="text-3xl font-bold text-[#e8e8e3] tracking-tight">
                  £179.99
                </p>
                <p className="text-sm text-[#c0c0c0] mb-3">/ yr</p>
                <p className="text-xs text-[#808080] tracking-wide">
                  Best value · Cancel anytime
                </p>
              </button>
            </div>

            {/* Input fields */}
            <div className="flex flex-col gap-4 mb-8">
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-widest uppercase outline-none transition-colors duration-200 rounded-none"
                />
                {errors.name && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-widest uppercase outline-none transition-colors duration-200 rounded-none"
                />
                {errors.email && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Discord username (e.g. jake#1234)"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-widest uppercase outline-none transition-colors duration-200 rounded-none"
                />
                {errors.discord && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">
                    {errors.discord}
                  </p>
                )}
              </div>
            </div>

            {/* Join CTA */}
            <button
              type="button"
              onClick={handleJoin}
              className="w-full px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white hover:shadow-[0_0_24px_rgba(232,232,227,0.15)]"
            >
              Join Ascend
            </button>
          </div>
        </section>
      )}
    </>
  );
}
