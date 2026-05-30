import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Ascend",
  description: "Your Ascend member dashboard.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
