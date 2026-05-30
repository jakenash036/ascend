import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://members.ascendescapeaverage.com"),
  title: "Ascend — Escape Average",
  description:
    "Ascend is a private operator community built for those who refuse to stay average. Leverage, ambition, and systems — join now.",
  openGraph: {
    title: "Ascend — Escape Average",
    description:
      "A private operator community focused on mindset, leverage, systems, attention, discipline and ambition.",
    url: "https://members.ascendescapeaverage.com",
    siteName: "Ascend",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Ascend — Escape Average",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascend — Escape Average",
    description:
      "A private operator community focused on mindset, leverage, systems, attention, discipline and ambition.",
    images: ["/og"],
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

