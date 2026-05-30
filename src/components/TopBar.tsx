"use client";

import { useEffect, useState } from "react";

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-40 w-full flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/95 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "border-b border-[#2a2a2a]" : "border-b border-transparent"
      }`}
    >
      <span className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium">
        Ascend
      </span>
      <a
        href="https://ascendescapeaverage.com/pages/dashboard"
        target="_top"
        className="text-xs tracking-[0.3em] uppercase text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200"
      >
        Sign In
      </a>
    </div>
  );
}
