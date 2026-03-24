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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
