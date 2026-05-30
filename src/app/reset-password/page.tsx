"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "./actions";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const err = await resetPasswordAction(token, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        setDone(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-[#ff4444] text-sm tracking-wide">
        Invalid reset link. Please request a new one.
      </p>
    );
  }

  return done ? (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#4ade80] tracking-wide">
        Password updated. You can now sign in.
      </p>
      <a
        href="https://ascendescapeaverage.com/pages/dashboard"
        target="_top"
        className="text-xs text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200 tracking-wide"
      >
        ← Go to sign in
      </a>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={loading}
          className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 pr-10 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#404040] hover:text-[#808080] transition-colors duration-200"
        >
          {showPassword ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        disabled={loading}
        className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
      />

      {error && <p className="text-[#ff4444] text-xs tracking-wide">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "UPDATING..." : "SET NEW PASSWORD"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="w-full flex items-center justify-between px-6 py-3 border-b border-[#2a2a2a]">
        <a
          href="https://ascendescapeaverage.com"
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
            Set new password
          </h1>
          <div className="chrome-line mb-8" aria-hidden="true" />
          <Suspense fallback={<p className="text-[#808080] text-sm">Loading...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
