import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CinemaRank - Rank Your Movies",
  description: "Discover your true movie preferences using pairwise comparisons and the Bradley-Terry model. Build your personal movie ranking by simply picking favorites.",
  keywords: ["movie ranking", "Bradley-Terry", "pairwise comparison", "movie ratings", "film ranking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
