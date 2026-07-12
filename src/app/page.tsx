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
