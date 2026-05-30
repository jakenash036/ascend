"use client";

import { useState, useEffect } from "react";

interface SubscriptionFlowProps {
  visible: boolean;
  onClose: () => void;
}

type Step = "hidden" | "aura" | "panel";

const VARIANT_ID = 56930326905210;
const MONTHLY_PLAN = 711948927354;
const YEARLY_PLAN = 711950795130;
const STORE_URL = "https://ascendescapeaverage.com";

const RINGS: [number, number, number][] = [
  [0,   0.90, 1.5],
  [190, 0.65, 1.0],
  [390, 0.45, 1.0],
  [610, 0.28, 1.0],
  [850, 0.14, 0.5],
];

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function isInIframe(): boolean {
  try { return window.self !== window.top; } catch { return true; }
}

export default function SubscriptionFlow({
  visible,
  onClose,
}: SubscriptionFlowProps) {
  const [step, setStep] = useState<Step>("hidden");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      const startAura = setTimeout(() => setStep("aura"), 0);
      const t = setTimeout(() => setStep("panel"), 1050);
      return () => {
        clearTimeout(startAura);
        clearTimeout(t);
      };
    } else {
      document.body.style.overflow = "";
      const reset = setTimeout(() => {
        setStep("hidden");
        setErrors({});
        setLoading(false);
      }, 0);
      return () => clearTimeout(reset);
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDotCount((d) => (d + 1) % 4);
    }, 350);
    return () => clearInterval(interval);
  }, [loading]);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Invalid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleJoin = async () => {
    if (!validate()) return;
    setLoading(true);
    setDotCount(0);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          plan: selectedPlan,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submit failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrors({ form: message });
      setLoading(false);
      return;
    }

    const sellingPlanId = selectedPlan === "monthly" ? MONTHLY_PLAN : YEARLY_PLAN;

    const cartData = {
      variantId: VARIANT_ID,
      sellingPlanId,
      properties: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        plan: selectedPlan,
      },
    };

    if (isInIframe()) {
      window.parent.postMessage({ type: "ascend-cart-add", cartData }, "*");
    } else {
      fetch(`${STORE_URL}/cart/clear.js`, { method: "POST" })
        .then(() =>
          fetch(`${STORE_URL}/cart/add.js`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: cartData.variantId,
              quantity: 1,
              selling_plan: cartData.sellingPlanId,
              properties: cartData.properties,
            }),
          })
        )
        .then(() => {
          window.location.href = `${STORE_URL}/checkout`;
        })
        .catch((err) => {
          console.error("Ascend cart error", err);
          setLoading(false);
        });
    }
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setSelectedPlan("monthly");
    setLoading(false);
    onClose();
  };

  const dots = ".".repeat(dotCount);
  const spaces = "\u00a0".repeat(3 - dotCount);

  if (step === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: "rgba(10,10,10,0.97)",
        animation: "overlay-emerge 500ms ease forwards",
      }}
    >
      {/* ── Aura layer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
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

      {/* ── Aura phase ── */}
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

      {/* ── Panel phase ── */}
      {step === "panel" && (
        <div
          className="relative z-10 w-full max-w-3xl mx-auto px-6 max-h-[90vh] overflow-y-auto"
          style={{ animation: "panel-rise 500ms cubic-bezier(0.2, 1, 0.3, 1) forwards" }}
        >
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

          <div className="chrome-line mb-10" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <button
              type="button"
              onClick={() => setSelectedPlan("monthly")}
              disabled={loading}
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

            <button
              type="button"
              onClick={() => setSelectedPlan("yearly")}
              disabled={loading}
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

          <div className="flex flex-col gap-4 mb-8">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
                />
                {errors.firstName && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
                />
                {errors.lastName && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
              />
              {errors.email && (
                <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 pr-10 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#404040] hover:text-[#808080] transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.password}</p>
                )}
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 pr-10 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#404040] hover:text-[#808080] transition-colors duration-200"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[#ff4444] text-xs mt-1 tracking-wide">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {errors.form && (
              <p className="text-[#ff4444] text-xs tracking-wide animate-fade-up">{errors.form}</p>
            )}
          </div>

          <p className="text-[#404040] text-xs tracking-widest uppercase text-center mb-4">
            Secure Checkout · Cancel Anytime
          </p>

          <button
            type="button"
            onClick={handleJoin}
            disabled={loading}
            className="w-full px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white disabled:cursor-not-allowed"
            style={
              loading
                ? {
                    background:
                      "linear-gradient(90deg, #c0c0c0 0%, #e8e8e3 40%, #ffffff 60%, #c0c0c0 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer-slide 1.2s linear infinite",
                  }
                : {}
            }
          >
            {loading ? `ASCENDING${dots}${spaces}` : "JOIN ASCEND"}
          </button>

          <style>{`
            @keyframes shimmer-slide {
              0%   { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
