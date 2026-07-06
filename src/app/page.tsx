import { AboutSection } from "@/components/landing/about-section";
import { CommunitySection } from "@/components/landing/community-section";
import { DomainsSection } from "@/components/landing/domains-section";
import { EventsSection } from "@/components/landing/events-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeSection } from "@/components/landing/marquee-section";
import { JoinSection } from "@/components/landing/join-section";

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ptsc-glow absolute -top-40 left-1/4 h-[520px] w-[520px] opacity-40 blur-2xl" />
        <div className="ptsc-glow-2 absolute -top-24 right-0 h-[420px] w-[420px] opacity-30 blur-2xl" />
        <div className="ptsc-glow-3 absolute top-[60vh] -left-24 h-[420px] w-[420px] opacity-25 blur-2xl" />
        <div className="ptsc-grid absolute inset-x-0 top-0 h-[80vh]" />
      </div>

      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <DomainsSection />
      <EventsSection />
      <CommunitySection />
      <JoinSection />
    </div>
  );
}
