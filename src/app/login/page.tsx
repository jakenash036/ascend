"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-6 py-3 border-b border-[#2a2a2a]">
        <a
          href="/"
          className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium hover:text-[#e8e8e3] transition-colors duration-200"
        >
          Ascend
        </a>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-2">
            Member Access
          </p>
          <h1 className="text-2xl font-semibold text-[#e8e8e3] tracking-tight mb-8">
            Sign in to Ascend
          </h1>

          <div className="chrome-line mb-8" aria-hidden="true" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c0c0c0] text-[#e8e8e3] placeholder-[#404040] px-4 py-3 text-sm tracking-wide outline-none transition-colors duration-200 disabled:opacity-40"
              />
            </div>

            {error && (
              <p className="text-[#ff4444] text-xs tracking-wide">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "SIGNING IN…" : "SIGN IN"}
            </button>
          </form>

          <p className="mt-8 text-xs text-[#404040] tracking-wide text-center">
            Not a member?{" "}
            <a href="/" className="text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200">
              Join Ascend
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
