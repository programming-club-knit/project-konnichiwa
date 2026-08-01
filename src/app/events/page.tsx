import { EventsPageContent } from "@/components/events/events-page-content";

export const metadata = {
  title: "Events | PTSC KNIT Sultanpur",
  description: "Discover our upcoming flagship hackathons, technical bootcamps, and networking summits, and explore the legacy of our past events.",
};

export default function EventsPage() {
  return (
    <main>
      <EventsPageContent />
    </main>
  );
}
