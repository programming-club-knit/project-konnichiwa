import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Geist, VT323, Pixelify_Sans, Press_Start_2P, Silkscreen } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GlobalPointer } from "@/components/global-pointer";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  weight: ["400", "600", "700"],
  variable: "--font-pixelify",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PTSC — Programming & Tech Skills Club | KNIT Sultanpur",
  description:
    "PTSC is the programming and technical skills club at KNIT Sultanpur. We build, learn and compete — from DSA and web dev to open source and hackathons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        spaceGrotesk.variable,
        geistMono.variable,
        vt323.variable,
        pixelifySans.variable,
        pressStart2P.variable,
        silkscreen.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="flex min-h-screen flex-col bg-[#0f0f0f] text-foreground relative">
        <GlobalPointer />
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
