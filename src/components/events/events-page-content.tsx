import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiArrowRight } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";
import type { EventItem } from "@/lib/events";

interface EventsPageContentProps {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
}

export function EventsPageContent({ upcomingEvents, pastEvents }: EventsPageContentProps) {
  return (
    <div className="relative min-h-screen bg-[#0B0D19] pt-24 pb-12 flex flex-col selection:bg-[#FF355E]/30">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-12 pb-8 w-full text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans leading-tight">
          Our{" "}
          <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
            <span className="text-[#FF355E]">Events.</span>
          </Highlighter>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#8C93B0] max-w-3xl mx-auto font-sans leading-relaxed">
          Discover our upcoming flagship hackathons, technical bootcamps, and networking summits, and explore the legacy of our past events.
        </p>
      </div>

      {/* UPCOMING & ONGOING */}
      <div className="relative z-10 w-full mt-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF355E] animate-pulse" />
            Currently Upcoming & Active
          </h2>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="mx-auto max-w-7xl px-6 lg:px-12 grid gap-6 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <div
                key={event._id || event.slug}
                className="group rounded-2xl p-7 flex flex-col justify-between border border-white/10 bg-[#121528] hover:border-white/20 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[#FF355E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#FF355E]/30">
                      {event.status}
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
                  <span className="text-xs font-mono text-white/40 uppercase">
                    {event.registrationType === "team" ? "Team Registration" : "Individual Entry"}
                  </span>
                  <Link
                    href={`/events/${event.slug || event._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#FF355E] hover:text-white transition-colors"
                  >
                    View Details & Register <FiArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12 text-center text-white/40 font-mono text-xs border border-white/10 rounded-2xl bg-[#121528]">
            No upcoming events currently scheduled. Stay tuned!
          </div>
        )}
      </div>

      {/* PAST EVENTS VAULT */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-24 w-full">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-12 border-b border-white/10 pb-6 flex items-center gap-4">
          Past Events Vault
          <span className="text-sm font-mono font-normal text-[#8C93B0]">{pastEvents.length} events</span>
        </h2>

        {pastEvents.length > 0 ? (
          <div className="flex flex-col divide-y divide-white/8">
            {pastEvents.map((event, index) => (
              <div
                key={event._id || event.slug}
                className="group flex flex-col sm:flex-row items-start gap-6 sm:gap-10 py-10 hover:bg-white/[0.02] transition-colors duration-300 -mx-4 px-4 rounded-2xl cursor-default"
              >
                <span className="hidden sm:block text-5xl font-black text-white/[0.06] font-mono tabular-nums shrink-0 w-12 pt-1 group-hover:text-white/10 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative w-full sm:w-40 h-28 sm:h-24 shrink-0 overflow-hidden rounded-xl bg-[#121528] border border-white/10 group-hover:border-white/20 transition-colors">
                  {event.coverImageUrl ? (
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover grayscale opacity-60 group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-xs font-mono text-white/30 uppercase">
                      PTSC
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      Past Event
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#8C93B0]">
                      <FiCalendar className="size-3 shrink-0" />
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "N/A"}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#FF355E] transition-colors duration-300 leading-tight mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#8C93B0] leading-relaxed line-clamp-2 max-w-2xl">
                    {event.description}
                  </p>
                </div>

                <Link
                  href={`/events/${event.slug || event._id}`}
                  className="hidden sm:flex items-center self-center shrink-0 size-9 rounded-full border border-white/10 bg-white/5 text-white/40 group-hover:border-[#FF355E]/40 group-hover:bg-[#FF355E]/10 group-hover:text-[#FF355E] transition-all duration-300"
                >
                  <svg className="size-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-white/30 font-mono text-xs">
            No archived past events found.
          </div>
        )}
      </div>
    </div>
  );
}
