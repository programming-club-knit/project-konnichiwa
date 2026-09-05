import React from 'react'
import Link from 'next/link'
import { FlickeringGrid } from '@/components/ui/flickering-grid'
import { ScatteredPolaroids } from '@/components/ui/scattered-polaroids'
import { EventPolaroid } from '@/components/events/event-polaroid'
import { getEvents } from '@/lib/events'
import { getEventDynamicStatus } from '@/lib/event-status'

async function getLatestEvent() {
    const events = await getEvents()
    if (!events.length) return null

    const now = new Date()

    // Try to find the nearest upcoming event first
    const upcoming = events
        .filter(e => {
            const status = getEventDynamicStatus(e, now)
            return status.isUpcoming || status.isLive
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (upcoming.length > 0) {
        return { event: upcoming[0], isUpcoming: true }
    }

    // Fallback to the most recently concluded event
    const past = events
        .filter(e => {
            const status = getEventDynamicStatus(e, now)
            return status.isPast
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (past.length > 0) {
        return { event: past[0], isUpcoming: false }
    }

    return { event: events[0], isUpcoming: false }
}

export default async function NewPage() {
    const latestEvent = await getLatestEvent()

    return (
        <>
            {/* hero section */}
            <section className="relative w-full overflow-hidden bg-[#0f0f0f]">
                {/* Flickering grid background — includes built-in bottom dither */}
                <FlickeringGrid
                    className="absolute inset-0 z-0"
                    squareSize={4}
                    gridGap={6}
                    flickerChance={0.3}
                    color="rgb(255, 53, 94)"
                    maxOpacity={0.15}
                    mouseInteraction
                    mouseRadius={180}
                    mouseMaxOpacity={0.55}
                    ditherBottom
                    ditherHeight={300}
                    ditherMaxOpacity={0.85}
                />

                {/* Hero content — responsive two-column layout */}
                <div className="relative z-10 flex flex-col gap-10 px-6 pb-8 pt-24 sm:px-10 md:flex-row md:items-center md:justify-between md:gap-12 md:px-12 md:pt-36 lg:px-16 lg:pt-44">
                    {/* Left: text content */}
                    <div className="flex-1">
                        {/* Big title with Press Start 2P font */}
                        <h1
                            className="text-[2.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[3.8rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[7.8rem]"
                            style={{ fontFamily: "var(--font-press-start), monospace" }}
                        >
                            PTSC
                        </h1>

                        {/* Description */}
                        <p
                            className="mt-6 max-w-xl text-xs font-medium uppercase leading-relaxed tracking-[0.12em] text-white/50 sm:text-sm md:mt-8 md:text-base"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            A student-led technical community that promotes
                            programming, problem-solving, and innovation
                            through workshops, competitions, and mentorship
                        </p>

                        {/* CTA Button */}
                        <Link
                            href="/events"
                            className="mt-6 inline-block bg-[#FF355E] px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#e02e52] hover:shadow-[0_8px_30px_rgba(255,53,94,0.4)] sm:px-8 sm:py-3.5 sm:text-sm md:mt-8"
                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                        >
                            Build With Us
                        </Link>
                    </div>

                    {/* Right: event polaroid (visible on mobile and desktop) */}
                    {latestEvent && (
                        <div className="mt-6 flex flex-shrink-0 justify-center md:mt-0 md:justify-end">
                            <EventPolaroid
                                event={latestEvent.event}
                                isUpcoming={latestEvent.isUpcoming}
                            />
                        </div>
                    )}
                </div>

                {/* Extra height to show the dither dissolve */}
                <div className="relative z-10 h-[140px] sm:h-[200px] md:h-[280px]" />
            </section>

            {/* Polaroids straddling the section boundary */}
            <div className="relative z-20 -mt-[110px] sm:-mt-[160px] md:-mt-[250px] mb-[-120px] md:mb-[-170px]">
                <ScatteredPolaroids />
            </div>

            {/* Next section */}
            <section className="relative w-full bg-[#0f0f0f] pt-48 pb-32">
                <div className="mx-auto max-w-5xl px-6 text-center">
                    <h2 className="text-3xl font-bold text-white/60">More content below...</h2>
                </div>
            </section>
        </>
    )
}