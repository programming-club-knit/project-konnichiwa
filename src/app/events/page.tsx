import { EventsPageContent } from "@/components/events/events-page-content";
import { getEvents } from "@/lib/events";
import { getEventDynamicStatus } from "@/lib/event-status";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | PTSC KNIT Sultanpur",
  description:
    "Discover our upcoming flagship hackathons, technical bootcamps, and networking summits, and explore the legacy of our past events.",
};

export default async function EventsPage() {
  const allEvents = await getEvents();
  const now = new Date();

  // Partition events dynamically based on date, time schedule & completion
  const liveEvents: typeof allEvents = [];
  const upcomingEvents: typeof allEvents = [];
  const pastEvents: typeof allEvents = [];

  for (const event of allEvents) {
    const timing = getEventDynamicStatus(event, now);
    if (timing.status === "live") {
      liveEvents.push(event);
    } else if (timing.status === "upcoming") {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  }

  // Sort upcoming chronologically (closest upcoming event first)
  upcomingEvents.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : Infinity;
    const dateB = b.date ? new Date(b.date).getTime() : Infinity;
    return dateA - dateB;
  });

  // Sort live events chronologically
  liveEvents.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });

  // Sort past events reverse-chronologically (most recently concluded first)
  pastEvents.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <main>
      <EventsPageContent
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        liveEvents={liveEvents}
      />
    </main>
  );
}
