import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeSection } from "@/components/landing/marquee-section";
import { UpcomingEventSection } from "@/components/landing/upcoming-event-section";
import { TeamSection } from "@/components/landing/team-section";
import { JoinSection } from "@/components/landing/join-section";

export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-[#0B0D19]">
      <HeroSection />
      <MarqueeSection />
      <UpcomingEventSection />
      <TeamSection />

    </div>
  );
}
