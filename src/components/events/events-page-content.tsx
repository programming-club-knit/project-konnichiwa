"use client";

import Image from "next/image";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";
import { UpcomingEventSection } from "@/components/landing/upcoming-event-section";

const PAST_EVENTS = [
  {
    id: "event-1",
    title: "PTSC Hackathon '25",
    date: "March 15, 2025",
    location: "KNIT Auditorium",
    imageSrc: "/teams/pfp.jpg",
    description: "Our flagship 24-hour hackathon bringing together the brightest minds to solve real-world problems.",
  },
  {
    id: "event-2",
    title: "Open Source Summit",
    date: "January 10, 2025",
    location: "Virtual (Discord)",
    imageSrc: "/teams/pfp.jpg",
    description: "A month-long open source contribution drive with expert talks and mentorship from industry leaders.",
  },
  {
    id: "event-3",
    title: "Web Dev Bootcamp",
    date: "November 22, 2024",
    location: "CS Seminar Hall",
    imageSrc: "/teams/pfp.jpg",
    description: "An intensive 3-day bootcamp covering modern web development frameworks and production architectures.",
  },
  {
    id: "event-4",
    title: "Alumni Interaction Session",
    date: "October 05, 2024",
    location: "KNIT Main Hall",
    imageSrc: "/teams/pfp.jpg",
    description: "Fireside chat with distinguished KNIT alumni working at top tech companies sharing their journey.",
  }
];

export function EventsPageContent() {
  return (
    <div className="relative min-h-screen bg-[#0B0D19] pt-24 pb-12 flex flex-col">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-12 pb-8 w-full text-center">
        {/* Header */}
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

      {/* UPCOMING EVENT SECTION (Reused from landing page, full width) */}
      <div className="relative z-10 w-full mt-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF355E] animate-pulse"></span>
            Currently Upcoming
          </h2>
        </div>
        <div className="border-y border-white/5 bg-[#121528]/30">
          <UpcomingEventSection />
        </div>
      </div>

      {/* PAST EVENTS SECTION */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-24 w-full">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-16 border-b border-white/10 pb-6 flex items-center gap-4">
          Past Events Vault
          <span className="text-sm font-mono font-normal text-[#8C93B0]">{PAST_EVENTS.length} events</span>
        </h2>

        <div className="flex flex-col divide-y divide-white/8">
          {PAST_EVENTS.map((event, index) => (
            <div
              key={event.id}
              className="group flex flex-col sm:flex-row items-start gap-6 sm:gap-10 py-10 hover:bg-white/[0.02] transition-colors duration-300 -mx-4 px-4 rounded-2xl cursor-default"
            >
              {/* Index Number */}
              <span className="hidden sm:block text-5xl font-black text-white/[0.06] font-mono tabular-nums shrink-0 w-12 pt-1 group-hover:text-white/10 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Thumbnail */}
              <div className="relative w-full sm:w-40 h-28 sm:h-24 shrink-0 overflow-hidden rounded-xl bg-[#121528] border border-white/10 group-hover:border-white/20 transition-colors">
                <Image
                  src={event.imageSrc}
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 160px"
                  className="object-cover grayscale opacity-60 group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FF355E] uppercase tracking-widest bg-[#FF355E]/10 px-2 py-0.5 rounded">
                    Past
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#8C93B0]">
                    <FiCalendar className="size-3 shrink-0" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#8C93B0]">
                    <FiMapPin className="size-3 shrink-0" /> {event.location}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#FF355E] transition-colors duration-300 leading-tight mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-[#8C93B0] leading-relaxed line-clamp-2 max-w-2xl">
                  {event.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="hidden sm:flex items-center self-center shrink-0 size-9 rounded-full border border-white/10 bg-white/5 text-white/40 group-hover:border-[#FF355E]/40 group-hover:bg-[#FF355E]/10 group-hover:text-[#FF355E] transition-all duration-300">
                <svg className="size-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
