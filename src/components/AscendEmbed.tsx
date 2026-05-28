/**
 * AscendEmbed
 *
 * This is the top-level reusable component for embedding the Ascend
 * landing/checkout experience inside Shopify (iframe or custom HTML block).
 *
 * To connect Shopify checkout: update SHOPIFY_CHECKOUT_URL in src/lib/constants.ts
 * To connect Discord automation: add webhook call on successful Shopify webhook
 * To connect Neon DB: add a server action / API route in src/app/api/
 */
import Hero from "@/components/Hero";
import WhatAscendIs from "@/components/WhatAscendIs";
import TheFramework from "@/components/TheFramework";
import CommunityAccess from "@/components/CommunityAccess";
import FinalCTA from "@/components/FinalCTA";

export default function AscendEmbed() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e8e8e3]">
      <Hero />
      <WhatAscendIs />
      <TheFramework />
      <CommunityAccess />
      <FinalCTA />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1e1e1e] text-center">
        <p className="text-[#404040] text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Ascend — Escape Average
        </p>
      </footer>
    </div>
  );
}
