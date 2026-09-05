"use client"

import React from "react"
import Link from "next/link"
import { EventCoverImage } from "@/components/events/event-cover-image"
import type { EventItem } from "@/lib/event-status"

interface EventPolaroidProps {
  event: EventItem
  isUpcoming: boolean
  className?: string
}

export function EventPolaroid({ event, isUpcoming, className = "" }: EventPolaroidProps) {
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const timeStr = event.time || ""

  return (
    <div className={`group flex justify-center ${className}`}>
      <div
        className="relative w-[280px] xs:w-[300px] sm:w-[320px] md:w-[340px] bg-white p-3 pb-4 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,53,94,0.25)] hover:rotate-0"
        style={{ transform: "rotate(2deg)" }}
      >
        {/* Event cover image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <EventCoverImage
            src={event.coverImageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="340px"
          />
          {/* Status badge */}
          <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            isUpcoming
              ? "bg-[#FF355E] text-white"
              : "bg-white/90 text-[#0f0f0f]"
          }`}>
            {isUpcoming ? "Upcoming" : "Concluded"}
          </div>
        </div>

        {/* Event details */}
        <div className="mt-3 space-y-1.5">
          <h3 className="truncate text-base font-bold tracking-tight text-[#0f0f0f]">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 text-[11px] text-neutral-500"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span>{formattedDate}</span>
            {timeStr && (
              <>
                <span className="text-neutral-300">•</span>
                <span>{timeStr}</span>
              </>
            )}
          </div>

          {event.venue && (
            <p className="truncate text-[11px] text-neutral-400"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              📍 {event.venue}
            </p>
          )}

          {/* CTA */}
          <Link
            href={isUpcoming ? `/events/${event.slug}/register` : `/events/${event.slug}`}
            className="mt-2 inline-block bg-[#0f0f0f] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#FF355E]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {isUpcoming ? "Register →" : "View Details →"}
          </Link>
        </div>
      </div>
    </div>
  )
}
