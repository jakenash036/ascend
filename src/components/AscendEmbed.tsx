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
"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import WhatAscendIs from "@/components/WhatAscendIs";
import TheFramework from "@/components/TheFramework";
import Testimonials from "@/components/Testimonials";
import CommunityAccess from "@/components/CommunityAccess";
import FounderSection from "@/components/FounderSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import SubscriptionFlow from "@/components/SubscriptionFlow";

export default function AscendEmbed() {
  const [showFlow, setShowFlow] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e8e8e3]">
      <div className="w-full bg-[#141414] border-b border-[#2a2a2a] py-2 px-6 text-center">
        <p className="text-[#c0c0c0] text-xs tracking-[0.3em] uppercase">
          Founding member pricing · Lock in your rate before it increases
        </p>
      </div>
      <TopBar />
      <Hero onJoin={() => setShowFlow(true)} />
      <WhatAscendIs />
      <TheFramework />
      <Testimonials />
      <CommunityAccess />
      <FounderSection />
      <PricingSection onJoin={() => setShowFlow(true)} />
      <FAQSection />
      <FinalCTA onJoin={() => setShowFlow(true)} />

      <footer className="py-8 px-6 border-t border-[#1e1e1e] text-center">
        <p className="text-[#404040] text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Ascend — Escape Average
        </p>
      </footer>

      <SubscriptionFlow visible={showFlow} onClose={() => setShowFlow(false)} />
    </div>
  );
}
