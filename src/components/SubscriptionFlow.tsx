"use client";

import { useState, useEffect } from "react";

interface SubscriptionFlowProps {
  visible: boolean;
  onClose: () => void;
}

type Step = "hidden" | "aura" | "panel";

const VARIANT_ID = "56930326905210";
const MONTHLY_PLAN = "711948927354";
const YEARLY_PLAN = "711950795130";
const STORE_URL = "https://ascendescapeaverage.com";

// Staggered aura rings: [delay ms, border opacity, border width px]
const RINGS: [number, number, number][] = [
  [0,   0.90, 1.5],
  [190, 0.65, 1.0],
  [390, 0.45, 1.0],
  [610, 0.28, 1.0],
  [850, 0.14, 0.5],
];

export default function SubscriptionFlow({
  visible,
  onClose,
}: SubscriptionFlowProps) {
  const [step, setStep] = useState<Step>("hidden");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      setStep("aura");
      const t = setTimeout(() => setStep("panel"), 1050);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
      setStep("hidden");
      setErrors({});
    }
    return () => { document.body.style.overflow = ""; };
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

    // IMPORTANT: Shopify cart attributes require literal square brackets in the URL.
    // URLSearchParams encodes [ and ] as %5B and %5D which breaks Shopify's
    // selling_plan parsing — so we build the query string manually.
    const sellingPlanId = selectedPlan === "monthly" ? MONTHLY_PLAN : YEARLY_PLAN;
    const query = [
      `selling_plan=${sellingPlanId}`,
      `attributes[name]=${encodeURIComponent(name.trim())}`,
      `attributes[email]=${encodeURIComponent(email.trim())}`,
      `attributes[discord]=${encodeURIComponent(discord.trim())}`,
      `attributes[plan]=${selectedPlan}`,
    ].join("&");

    window.location.href = `${STORE_URL}/cart/${VARIANT_ID}:1?${query}`;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "rgba(10,10,10,0.97)",
        animation: "overlay-emerge 500ms ease forwards",
      }}
    >
      {/* ── Aura layer ── always present so rings continue glowing behind the panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {/* Central radial glow */}
        <div
          className="absolute"
          style={{
            width: "100vmax",
            height: "100vmax",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(192,192,192,0.18) 0%, rgba(192,192,192,0.06) 22%, transparent 55%)",
            animation: "aura-glow 1800ms cubic-bezier(0.2, 0, 0.6, 1) forwards",
          }}
        />

        {/* Expanding concentric rings */}
        {RINGS.map(([delay, opacity, width], i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: "100vmax",
              height: "100vmax",
              borderRadius: "50%",
              border: `${width}px solid rgba(192,192,192,${opacity})`,
              animation: `aura-ring 1200ms cubic-bezier(0.1, 0.7, 0.2, 1) ${delay}ms forwards`,
            }}
          />
        ))}
      </div>

      {/* ── Aura phase: ASCEND wordmark flashes in silver light ── */}
      {step === "aura" && (
        <div
          aria-hidden="true"
          className="relative z-10 flex flex-col items-center gap-4 select-none"
          style={{ animation: "ascend-flash 1050ms ease forwards" }}
        >
          <div className="chrome-line w-16" />
          <span className="text-[#c0c0c0] font-bold tracking-[0.55em] uppercase text-4xl sm:text-6xl">
            ASCEND
          </span>
          <div className="chrome-line w-16" />
        </div>
      )}

      {/* ── Panel phase: subscription form, centered in viewport ── */}
      {step === "panel" && (
        <div
          className="relative z-10 w-full max-w-3xl mx-auto px-6 max-h-[90vh] overflow-y-auto"
          style={{ animation: "panel-rise 500ms cubic-bezier(0.2, 1, 0.3, 1) forwards" }}
        >
          {/* Header row */}
          <div className="flex items-start justify-between mb-10">
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

          {/* Chrome divider */}
          <div className="chrome-line mb-10" aria-hidden="true" />

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {/* Monthly */}
            <button
              type="button"
              onClick={() => setSelectedPlan("monthly")}
              className={`text-left p-6 bg-[#141414] border transition-colors duration-200 ${
                selectedPlan === "monthly"
                  ? "border-[#c0c0c0]"
                  : "border-[#2a2a2a] hover:border-[#404040]"
              }`}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-4">Monthly</p>
              <p className="text-3xl font-bold text-[#e8e8e3] tracking-tight">£19.99</p>
              <p className="text-sm text-[#c0c0c0] mb-3">/ mo</p>
              <p className="text-xs text-[#808080] tracking-wide">Billed monthly · Cancel anytime</p>
            </button>

            {/* Yearly */}
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
              <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-4">Yearly</p>
              <p className="text-3xl font-bold text-[#e8e8e3] tracking-tight">£179.99</p>
              <p className="text-sm text-[#c0c0c0] mb-3">/ yr</p>
              <p className="text-xs text-[#808080] tracking-wide">Best value · Cancel anytime</p>
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
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-widest uppercase outline-none transition-colors duration-200"
              />
              {errors.name && (
                <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-widest uppercase outline-none transition-colors duration-200"
              />
              {errors.email && (
                <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Discord username (e.g. jake#1234)"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-widest uppercase outline-none transition-colors duration-200"
              />
              {errors.discord && (
                <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.discord}</p>
              )}
            </div>
          </div>

          {/* Join CTA */}
          <button
            type="button"
            onClick={handleJoin}
            className="w-full px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white"
          >
            Join Ascend
          </button>
        </div>
      )}
    </div>
  );
}
