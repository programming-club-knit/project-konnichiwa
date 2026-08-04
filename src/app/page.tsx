import { HeroSection } from "@/components/landing/hero-section";
import { MarqueeSection } from "@/components/landing/marquee-section";
import { UpcomingEventSection } from "@/components/landing/upcoming-event-section";
import { EventsSection } from "@/components/landing/events-section";
import { ActivitiesSection } from "@/components/landing/activities-section";
import { TeamSection } from "@/components/landing/team-section";
import { getEvents } from "@/lib/events";

// Fetch events once at the server level — no client fetching needed
export default async function Home() {
  const allEvents = await getEvents();
  const featuredEvent =
    allEvents.find((e) => e.status === "upcoming" || e.status === "ongoing") ??
    allEvents[0] ??
    null;
  const landingEvents = allEvents.slice(0, 4);

  return (
    <div className="relative overflow-x-clip bg-[#0B0D19]">
      <HeroSection />
      <MarqueeSection />
      <UpcomingEventSection event={featuredEvent} />
      <EventsSection events={landingEvents} />
      <ActivitiesSection />
      <TeamSection />
    </div>
  );
}
