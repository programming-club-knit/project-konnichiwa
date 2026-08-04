import { notFound } from "next/navigation";
import { EventDetailContent } from "@/components/events/event-detail-content";
import { getEventBySlug } from "@/lib/events";
import type { Metadata } from "next";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return { title: "Event Not Found | PTSC" };
  }
  return {
    title: `${event.title} | PTSC Events`,
    description: event.description?.slice(0, 160) || "View event details and register at PTSC KNIT Sultanpur.",
  };
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailContent event={event as any} />;
}
