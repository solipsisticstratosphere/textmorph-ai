import type React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TextMorph AI - Transform your thoughts into perfect form",
  description:
    "Empower users to instantly transform any text into the exact format, style, or structure they need using AI-powered text transformation.",
  keywords: [
    "AI",
    "text transformation",
    "writing assistant",
    "content creation",
    "text formatting",
  ],
  authors: [{ name: "TextMorph AI Team" }],
  creator: "TextMorph AI",
  publisher: "TextMorph AI",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://textmorph.ai",
    title: "TextMorph AI - Transform your thoughts into perfect form",
    description:
      "Empower users to instantly transform any text into the exact format, style, or structure they need using AI-powered text transformation.",
    siteName: "TextMorph AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TextMorph AI - Transform your thoughts into perfect form",
    description:
      "Empower users to instantly transform any text into the exact format, style, or structure they need using AI-powered text transformation.",
    creator: "@textmorphai",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
