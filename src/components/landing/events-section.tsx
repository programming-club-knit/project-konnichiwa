import Image from "next/image";
import Link from "next/link";
import { FiChevronRight, FiCalendar, FiImage } from "react-icons/fi";
import { SectionHeader } from "./section-header";
import type { EventItem } from "@/lib/events";

interface EventsSectionProps {
  events: EventItem[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section id="events" className="relative bg-[#0B0D19] py-24 selection:bg-white/20 overflow-hidden">
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {events.map((event) => (
              <div
                key={event._id || event.slug}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#121528]"
              >
                {/* Compact Image Banner */}
                <div className="relative w-full h-48 sm:h-52 bg-[#07080F] border-b border-white/10 flex items-center justify-center overflow-hidden">
                  {event.coverImageUrl ? (
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center p-4 text-center bg-[#0E101D]">
                      <div className="grid size-12 place-items-center rounded-xl bg-white/5 border border-white/10">
                        <FiImage className="size-6 text-[#FF355E]/70" />
                      </div>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="rounded bg-[#FF355E] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-sm">
                      {event.status || "Upcoming"}
                    </span>
                    <span className="rounded bg-[#07080F]/90 border border-white/20 px-2.5 py-1 text-xs font-mono text-white flex items-center gap-1.5">
                      <FiCalendar className="size-3 text-[#FF355E]" />
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "TBA"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight text-white leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#8C93B0] line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Link
                      href={`/events/${event.slug || event._id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF355E] py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider text-white"
                    >
                      Learn More & Register <FiChevronRight className="size-4" />
                    </Link>
                  </div>
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