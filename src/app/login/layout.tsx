import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Ascend",
  description: "Sign in to your Ascend member dashboard.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
