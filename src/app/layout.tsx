import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Ascend — Escape Average",
  description:
    "Ascend is a private operator community built for those who refuse to stay average. Leverage, ambition, and systems — join now.",
  openGraph: {
    title: "Ascend — Escape Average",
    description:
      "A private operator community focused on mindset, leverage, systems, attention, discipline and ambition.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascend — Escape Average",
    description:
      "A private operator community focused on mindset, leverage, systems, attention, discipline and ambition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e8e8e3]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

