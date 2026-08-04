import { EventsPageContent } from "@/components/events/events-page-content";
import { getEvents } from "@/lib/events";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | PTSC KNIT Sultanpur",
  description:
    "Discover our upcoming flagship hackathons, technical bootcamps, and networking summits, and explore the legacy of our past events.",
};

export default async function EventsPage() {
  const allEvents = await getEvents();
  const upcomingEvents = allEvents.filter(
    (e) => e.status === "upcoming" || e.status === "ongoing"
  );
  const pastEvents = allEvents.filter((e) => e.status === "past");

  return (
    <main>
      <EventsPageContent upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
    </main>
  );
}
