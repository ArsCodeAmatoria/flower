import type { Metadata } from "next";
import {
  Cinzel,
  Cinzel_Decorative,
  Cormorant_Garamond,
  Courier_Prime,
  Dancing_Script,
  IBM_Plex_Mono,
  Style_Script,
} from "next/font/google";
import "./globals.css";

const styleScript = Style_Script({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "400",
});

/** Bolder script for hero wordmark when PNG logo is unavailable */
const logoScript = Dancing_Script({
  variable: "--font-logo-script",
  subsets: ["latin"],
  weight: "700",
});

const cinzel = Cinzel({
  variable: "--font-cinematic",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const courierPrime = Courier_Prime({
  variable: "--font-screenplay",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/** Classic film billing — credit cards & ornamental display (not screenplay). */
const cormorantCredits = Cormorant_Garamond({
  variable: "--font-credits",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-credits-ornate",
  subsets: ["latin"],
  weight: "400",
});

/** Industrial / technical readouts (personnel files, script addenda). */
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-industrial",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "FLOWER — Animated musical feature",
  description:
    "Animated musical — a scentless flower girl in a world of hue and perfume discovers her difference is magic. Lynne Tapper, Leigh Akin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${styleScript.variable} ${logoScript.variable} ${cinzel.variable} ${courierPrime.variable} ${cormorantCredits.variable} ${cinzelDecorative.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">{children}</body>
    </html>
  );
}
