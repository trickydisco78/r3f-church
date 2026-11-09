import type { Metadata } from "next";
import { Caveat, Dancing_Script, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/data/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Handwritten face for the "RT" logo mark in the site header.
const handwriting = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["700"],
});

// Script face for the handwritten body of the Church Committee letter.
const letterHand = Dancing_Script({
  variable: "--font-letter",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${handwriting.variable} ${letterHand.variable} h-full antialiased`}
    >
      <head>
        {/* Sets the saved/system theme before first paint to avoid a flash (see lib/theme.ts). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
