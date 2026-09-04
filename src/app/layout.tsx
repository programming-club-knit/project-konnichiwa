import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk, Geist } from "next/font/google";
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

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      className={cn("dark", "h-full", "antialiased", spaceGrotesk.variable, ibmPlexMono.variable, "font-sans", geist.variable)}
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
