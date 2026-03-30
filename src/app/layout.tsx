import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, Cormorant_Garamond, Courier_Prime, Style_Script } from "next/font/google";
import "./globals.css";

const styleScript = Style_Script({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "400",
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

export const metadata: Metadata = {
  title: "FLOWER — Animated musical feature",
  description:
    "FLOWER: created by Lynne Tapper, co-written by Leigh Akin, songs by Leigh Akin — an animated musical about presence and belonging.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${styleScript.variable} ${cinzel.variable} ${courierPrime.variable} ${cormorantCredits.variable} ${cinzelDecorative.variable}`}
    >
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
