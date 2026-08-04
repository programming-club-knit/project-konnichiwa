import Link from "next/link";
import { FiChevronRight, FiCalendar } from "react-icons/fi";
import { SectionHeader } from "./section-header";
import type { EventItem } from "@/lib/events";

interface EventsSectionProps {
  events: EventItem[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section id="events" className="relative bg-[#0B0D19] py-24 selection:bg-white/20">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Tournaments & Events"
          title="Something Happening Every Week"
          desc="Contests, bootcamps, talks and flagship hackathons — explore what's happening at PTSC."
        />

        {events.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event._id || event.slug}
                className="playgame-card group rounded-2xl p-7 flex flex-col justify-between border border-white/10 bg-[#0E101D] hover:border-white/20 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[#FF355E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#FF355E]/30">
                      {event.status || "Upcoming"}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#8C93B0] flex items-center gap-1.5">
                      <FiCalendar className="size-3 text-[#FF355E]" />
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "TBA"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-white group-hover:text-[#FF355E] transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8C93B0] line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/events/${event.slug || event._id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:translate-x-1 transition-transform text-white"
                  >
                    Learn More
                    <FiChevronRight className="size-4 text-[#FF355E]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 py-16 text-center text-white/40 font-mono text-xs border border-white/10 rounded-2xl bg-[#0E101D]">
            No upcoming events scheduled right now. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
}