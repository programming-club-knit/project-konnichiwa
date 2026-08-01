"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiMapPin, FiImage } from "react-icons/fi";
import type { EventItem } from "@/lib/events";

interface UpcomingEventSectionProps {
  event: EventItem | null;
}

export function UpcomingEventSection({ event }: UpcomingEventSectionProps) {
  if (!event) return null;

  return (
    <section id="upcoming-event" className="relative bg-[#000000] py-24 border-b border-white/5 overflow-hidden">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-8 lg:gap-12 items-stretch">

          {/* Left: Poster Image / Placeholder */}
          <div className="relative min-h-[360px] lg:min-h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-[#121528] flex flex-col items-center justify-center group">
            {event.coverImageUrl ? (
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center px-8">
                <div className="grid size-20 place-items-center rounded-2xl bg-white/5 border border-dashed border-white/20 group-hover:bg-[#FF355E]/5 group-hover:border-[#FF355E]/30 transition-all duration-300">
                  <FiImage className="size-9 text-white/20 group-hover:text-[#FF355E]/50 transition-colors duration-300" />
                </div>
                <p className="text-xs font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                  {event.title}
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#FF355E]/10 border border-[#FF355E]/20 px-3 py-1 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#FF355E] animate-pulse" />
              <span className="text-[10px] font-black text-[#FF355E] uppercase tracking-widest">
                {event.status || "Upcoming"}
              </span>
            </div>
          </div>

          {/* Right: Event Details */}
          <div className="flex flex-col justify-center gap-6">
            <p className="text-xs font-mono font-bold text-[#8C93B0] uppercase tracking-widest">
              Featured Event
            </p>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.1]">
              {event.title}
            </h2>

            <p className="text-base text-[#8C93B0] leading-relaxed max-w-lg">
              {event.description}
            </p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-sm font-medium text-white/70 font-mono">
                <FiCalendar className="size-4 text-[#FF355E] shrink-0" />
                {event.date
                  ? new Date(event.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                  : "TBA"}
                {event.time ? ` at ${event.time}` : ""}
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-white/70 font-mono">
                <FiMapPin className="size-4 text-[#FF355E] shrink-0" />
                KNIT Sultanpur &bull;{" "}
                {event.registrationType === "team" ? "Team Registration" : "Individual Entry"}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/events/${event.slug || event._id}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF355E] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#FF355E]/20 hover:bg-[#FF4D70] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 group"
              >
                Register & Details <FiArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
