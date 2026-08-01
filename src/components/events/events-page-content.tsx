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
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 border-b border-white/10 pb-6">
          Past Events Vault
        </h2>
        
        <div className="grid gap-8 sm:grid-cols-2">
          {PAST_EVENTS.map((event) => (
            <div 
              key={event.id}
              className="group relative overflow-hidden rounded-2xl bg-[#121528] border border-white/10 transition-all duration-300 hover:border-white/30 flex flex-col sm:flex-row h-full hover:shadow-2xl hover:shadow-black/50"
            >
              {/* Event Image */}
              <div className="relative h-48 sm:h-auto sm:w-2/5 overflow-hidden bg-[#0B0D19] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10">
                <Image 
                  src={event.imageSrc}
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                />
              </div>
              
              {/* Event Details */}
              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-center">
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#FF355E] transition-colors leading-tight">
                  {event.title}
                </h3>
                <p className="text-sm text-[#8C93B0] line-clamp-3 mb-6 leading-relaxed font-medium">
                  {event.description}
                </p>
                
                <div className="mt-auto space-y-2.5 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-white/70 uppercase tracking-wider">
                    <FiCalendar className="size-3.5 text-[#FF355E]" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-bold text-white/70 uppercase tracking-wider">
                    <FiMapPin className="size-3.5 text-[#FF355E]" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
