"use client";

import { useState } from "react";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPasswordAction(email);
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="w-full flex items-center justify-between px-6 py-3 border-b border-[#2a2a2a]">
        <a
          href="https://ascendescapeaverage.com/pages/dashboard"
          target="_top"
          className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium hover:text-[#e8e8e3] transition-colors duration-200"
        >
          Ascend
        </a>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-2">Member Access</p>
          <h1 className="text-2xl font-semibold text-[#e8e8e3] tracking-tight mb-8">
            Reset password
          </h1>

          <div className="chrome-line mb-8" aria-hidden="true" />

          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#4ade80] tracking-wide">
                If that email exists, a reset link has been sent. Check your inbox.
              </p>
              <a
                href="https://ascendescapeaverage.com/pages/dashboard"
                target="_top"
                className="text-xs text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200 tracking-wide"
              >
                ← Back to sign in
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
              />

              {error && (
                <p className="text-[#ff4444] text-xs tracking-wide">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>

              <a
                href="https://ascendescapeaverage.com/pages/dashboard"
                target="_top"
                className="text-xs text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200 tracking-wide text-center"
              >
                ← Back to sign in
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
