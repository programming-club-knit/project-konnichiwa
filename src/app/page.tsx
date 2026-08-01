import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeSection } from "@/components/landing/marquee-section";
import { UpcomingEventSection } from "@/components/landing/upcoming-event-section";
import { ActivitiesSection } from "@/components/landing/activities-section";
import { TeamSection } from "@/components/landing/team-section";

export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-[#0B0D19]">
      <HeroSection />
      <MarqueeSection />
      <UpcomingEventSection />
      <ActivitiesSection />
      <TeamSection />
    </div>
  );
}
