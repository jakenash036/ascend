"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs tracking-[0.3em] uppercase text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200"
    >
      Sign Out
    </button>
  );
}
