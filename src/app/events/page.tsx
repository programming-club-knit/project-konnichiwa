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
  const now = new Date();

  const pastEvents = allEvents.filter((e) => {
    const statusLower = (e.status || "").toLowerCase();
    const isExplicitPast = statusLower === "past" || statusLower === "completed" || Boolean(e.completed);
    if (isExplicitPast) return true;

    // If status is not explicitly active ("upcoming" / "ongoing") and date is in the past, classify as past
    if (e.date && new Date(e.date) < now && statusLower !== "upcoming" && statusLower !== "ongoing") {
      return true;
    }
    return false;
  });

  const upcomingEvents = allEvents.filter((e) => !pastEvents.includes(e));

  return (
    <main>
      <EventsPageContent upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
    </main>
  );
}
