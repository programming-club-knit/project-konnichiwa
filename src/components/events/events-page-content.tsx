"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiCalendar, 
  FiClock, 
  FiArrowRight, 
  FiUsers, 
  FiUser, 
  FiImage, 
  FiMapPin, 
  FiGlobe, 
  FiSearch, 
  FiBookOpen, 
  FiAward,
  FiLoader
} from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";
import { type EventItem, getEventDynamicStatus } from "@/lib/event-status";

interface EventsPageContentProps {
  upcomingEvents: EventItem[];
  pastEvents: EventItem[];
  liveEvents?: EventItem[];
}

export function EventsPageContent({
  upcomingEvents,
  pastEvents,
  liveEvents = [],
}: EventsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "live" | "upcoming" | "past" | "online" | "offline"
  >("all");

  const [clientEvents, setClientEvents] = useState<EventItem[] | null>(null);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const initialServerCount = liveEvents.length + upcomingEvents.length + pastEvents.length;
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Background live sync ensures latest events on Vercel deployment even if edge cache is stale
    if (initialServerCount === 0) {
      setLoadingLive(true);
    }

    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.events) && data.events.length > 0) {
          setClientEvents(data.events);
        }
      })
      .catch((err) => {
        console.error("Events live sync error:", err);
      })
      .finally(() => {
        setLoadingLive(false);
      });
  }, [initialServerCount]);

  const allEvents = useMemo(() => {
    if (clientEvents && clientEvents.length > 0) {
      return clientEvents;
    }
    return [...liveEvents, ...upcomingEvents, ...pastEvents];
  }, [clientEvents, liveEvents, upcomingEvents, pastEvents]);

  // Dynamically partition and track timing
  const liveList = useMemo(() => {
    return allEvents.filter((e) => getEventDynamicStatus(e).status === "live");
  }, [allEvents]);

  const upcomingList = useMemo(() => {
    return allEvents.filter((e) => getEventDynamicStatus(e).status === "upcoming");
  }, [allEvents]);

  const pastList = useMemo(() => {
    return allEvents.filter((e) => getEventDynamicStatus(e).status === "past");
  }, [allEvents]);

  // Filtered list with intelligent sorting: Live first, then upcoming (closest date), then past (newest)
  const filteredEvents = useMemo(() => {
    const filtered = allEvents.filter((event) => {
      const timing = getEventDynamicStatus(event);
      const isLive = timing.status === "live";
      const isUpcoming = timing.status === "upcoming";
      const isPast = timing.status === "past";
      const isOnline = event.eventType === "online";
      const isOffline = event.eventType === "offline" || !event.eventType;

      // Filter by category tab
      if (filterType === "live" && !isLive) return false;
      if (filterType === "upcoming" && !isUpcoming) return false;
      if (filterType === "past" && !isPast) return false;
      if (filterType === "online" && !isOnline) return false;
      if (filterType === "offline" && !isOffline) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = event.title?.toLowerCase().includes(q);
        const descMatch = event.description?.toLowerCase().includes(q);
        const venueMatch = event.venue?.toLowerCase().includes(q);
        const platformMatch = event.platform?.toLowerCase().includes(q);
        return titleMatch || descMatch || venueMatch || platformMatch;
      }

      return true;
    });

    // If viewing all, online, or offline, sort: Live first -> Upcoming (earliest first) -> Past (latest first)
    return filtered.sort((a, b) => {
      const timingA = getEventDynamicStatus(a);
      const timingB = getEventDynamicStatus(b);

      const rank = (status: string) => (status === "live" ? 0 : status === "upcoming" ? 1 : 2);
      const rankA = rank(timingA.status);
      const rankB = rank(timingB.status);

      if (rankA !== rankB) return rankA - rankB;

      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      if (rankA === 1) {
        // Upcoming: soonest event first
        return dateA - dateB;
      }
      // Past or Live: newest date first
      return dateB - dateA;
    });
  }, [allEvents, filterType, searchQuery]);

  // Featured flagship spotlight: Live event first, then next upcoming event, or most recent
  const featuredEvent = useMemo(() => {
    if (liveList.length > 0) return liveList[0];
    if (upcomingList.length > 0) return upcomingList[0];
    if (allEvents.length > 0) return allEvents[0];
    return null;
  }, [liveList, upcomingList, allEvents]);

  const featuredTiming = useMemo(() => {
    return featuredEvent ? getEventDynamicStatus(featuredEvent) : null;
  }, [featuredEvent]);

  // Dynamic filter tabs
  const filterTabs = useMemo(() => {
    const tabs: {
      id: "all" | "live" | "upcoming" | "past" | "online" | "offline";
      label: string;
      count: number;
      isLiveTab?: boolean;
    }[] = [{ id: "all", label: "All Events", count: allEvents.length }];

    if (liveList.length > 0) {
      tabs.push({
        id: "live",
        label: "Live Now",
        count: liveList.length,
        isLiveTab: true,
      });
    }

    tabs.push(
      { id: "upcoming", label: "Upcoming", count: upcomingList.length },
      { id: "past", label: "Archived Vault", count: pastList.length },
      {
        id: "online",
        label: "Online",
        count: allEvents.filter((e) => e.eventType === "online").length,
      },
      {
        id: "offline",
        label: "Campus Offline",
        count: allEvents.filter((e) => e.eventType !== "online").length,
      }
    );

    return tabs;
  }, [allEvents, liveList.length, upcomingList.length, pastList.length]);

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] pt-24 pb-20 flex flex-col selection:bg-[#FF355E]/30 font-sans text-slate-200">
      {/* Vertical Dashed Guidelines Overlay matching /people */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-10 pb-6 w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans leading-tight">
            Events &{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-[#FF355E]">Contests.</span>
            </Highlighter>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#8C93B0] max-w-3xl mx-auto font-sans leading-relaxed">
            From overnight hackathons and high-stakes coding arenas to technical masterclasses and bootcamps at KNIT Sultanpur.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="mt-10 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 rounded-2xl bg-[#121626] border border-white/10 shadow-lg">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  filterType === tab.id
                    ? tab.isLiveTab
                      ? "bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "bg-white text-slate-900 font-semibold shadow-md"
                    : tab.isLiveTab
                    ? "text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.isLiveTab && (
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                )}
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    filterType === tab.id
                      ? "bg-slate-900/15 text-slate-900 font-bold"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px] md:max-w-xs px-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contests & workshops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#090B14] border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-all font-sans"
            />
          </div>
        </div>

        {/* FEATURED FLAGSHIP SPOTLIGHT (Shown when filter is 'all', 'live', or 'upcoming' and no search query) */}
        {!searchQuery && (filterType === "all" || filterType === "live" || filterType === "upcoming") && featuredEvent && featuredTiming && (
          <div className="mb-14">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide uppercase mb-3">
              <span
                className={`size-2 rounded-full ${
                  featuredTiming.isLive ? "bg-emerald-400 animate-ping" : "bg-[#FF355E]"
                }`}
              />
              <span>
                {featuredTiming.isLive
                  ? "Live Competition Spotlight"
                  : featuredTiming.isPast
                  ? "Recent Event Spotlight"
                  : "Flagship Spotlight"}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-[#141414] border border-white/15 hover:border-white/25 transition-all shadow-2xl group flex flex-col lg:flex-row items-stretch">
              {/* Left: Poster / Cover Showcase */}
              <div className="relative lg:w-1/2 min-h-[280px] sm:min-h-[340px] bg-[#1a1a1a] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                {featuredEvent.coverImageUrl ? (
                  <Image
                    src={featuredEvent.coverImageUrl}
                    alt={featuredEvent.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="size-full flex flex-col items-center justify-center p-6 text-center bg-[#0B0E1A]">
                    <div className="grid size-16 place-items-center rounded-2xl bg-white/5 border border-white/10">
                      <FiImage className="size-8 text-[#FF355E]" />
                    </div>
                    <span className="mt-3 text-xs font-semibold text-slate-400">
                      Official Flagship Poster
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121626] via-transparent to-transparent lg:bg-gradient-to-r opacity-60" />

                {/* Floating Format Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-xs shadow-lg flex items-center gap-1.5 ${
                      featuredTiming.isLive
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] backdrop-blur-md"
                        : featuredTiming.isPast
                        ? "bg-slate-900/90 border border-white/20 text-slate-300 backdrop-blur-md"
                        : "bg-[#FF355E] text-white"
                    }`}
                  >
                    {featuredTiming.isLive && (
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    {featuredTiming.label}
                  </span>
                  {featuredEvent.eventType === "online" ? (
                    <span className="px-3 py-1 rounded-full bg-[#090B14]/90 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5">
                      <FiGlobe className="size-3" /> Online {featuredEvent.platform ? `(${featuredEvent.platform})` : ""}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#090B14]/90 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-medium flex items-center gap-1.5">
                      <FiMapPin className="size-3 text-[#FF355E]" /> Campus Offline
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Rich Details & CTA */}
              <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Meta Pills */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                      <FiCalendar className="size-3.5 text-[#FF355E]" />
                      {featuredEvent.date
                        ? new Date(featuredEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Date TBA"}
                    </span>
                    {featuredEvent.time && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                        <FiClock className="size-3.5 text-amber-400" />
                        {featuredEvent.time}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                      {featuredEvent.registrationType === "team" ? (
                        <>
                          <FiUsers className="size-3.5 text-blue-400" /> Team Event ({featuredEvent.teamMinSize || 2}-{featuredEvent.teamMaxSize || 4} Members)
                        </>
                      ) : (
                        <>
                          <FiUser className="size-3.5 text-emerald-400" /> Solo Entry
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {featuredEvent.description}
                  </p>

                  {/* Deadline Notice */}
                  {featuredEvent.registrationDeadline && !featuredTiming.isPast && (
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                        featuredTiming.isRegistrationClosed
                          ? "bg-red-500/10 border-red-500/30 text-red-300"
                          : "bg-[#0f0f0f] border-amber-500/30 text-amber-300"
                      }`}
                    >
                      <FiClock
                        className={`size-4 shrink-0 ${
                          featuredTiming.isRegistrationClosed
                            ? "text-red-400"
                            : "text-amber-400 animate-pulse"
                        }`}
                      />
                      <span>
                        {featuredTiming.isRegistrationClosed
                          ? `Registration Closed (Deadline was ${featuredTiming.registrationDeadlineLabel})`
                          : `Registration Closes: ${featuredTiming.registrationDeadlineLabel}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href={`/events/${featuredEvent.slug || featuredEvent._id}`}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md ${
                      featuredTiming.isLive
                        ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                        : featuredTiming.isPast
                        ? "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                        : "bg-white text-slate-900 hover:bg-slate-200 font-semibold"
                    }`}
                  >
                    {featuredTiming.isLive
                      ? "Enter Live Event & Details"
                      : featuredTiming.isPast
                      ? "View Archived Event"
                      : featuredTiming.isRegistrationClosed
                      ? "View Event Details"
                      : "View Details & Register"}{" "}
                    <FiArrowRight className="size-4" />
                  </Link>
                  {featuredEvent.ruleBookUrl && (
                    <a
                      href={featuredEvent.ruleBookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
                    >
                      <FiBookOpen className="size-3.5" /> Rulebook
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EVENTS SHOWCASE GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-[#FF355E]" />
              <span>
                {filterType === "past"
                  ? "Archived Events Vault"
                  : filterType === "live"
                  ? "Live Competitions Happening Now"
                  : filterType === "upcoming"
                  ? "Upcoming Competitions & Tournaments"
                  : "All Club Events & Competitions"}
              </span>
            </h2>
            <span className="text-xs font-medium text-slate-400">
              {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"}
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const timing = getEventDynamicStatus(event);
                const { isPast, isLive, isUpcoming, label } = timing;

                return (
                  <div
                    key={event._id || event.slug}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#121626] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    {/* Event Banner Container */}
                    <div className="relative w-full h-48 bg-[#090B14] border-b border-white/10 overflow-hidden flex items-center justify-center">
                      {event.coverImageUrl ? (
                        <Image
                          src={event.coverImageUrl}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center p-4 text-center bg-[#070913]">
                          <div className="grid size-12 place-items-center rounded-xl bg-white/5 border border-white/10">
                            <FiImage className="size-6 text-slate-500" />
                          </div>
                          <span className="mt-2 text-xs font-medium text-slate-500">
                            PTSC Event
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121626] via-transparent to-transparent opacity-60" />

                      {/* Top Glass Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-semibold border shadow-md flex items-center gap-1.5 ${
                            isLive
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)] backdrop-blur-md"
                              : isPast
                              ? "bg-slate-900/90 border-white/20 text-slate-400 backdrop-blur-md"
                              : "bg-[#FF355E] border-transparent text-white shadow-[0_2px_8px_rgba(255,53,94,0.3)]"
                          }`}
                        >
                          {isLive && (
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                          )}
                          {label}
                        </span>

                        <span className="px-2.5 py-0.5 rounded bg-[#090B14]/85 backdrop-blur-md border border-white/15 text-xs text-slate-200 flex items-center gap-1.5">
                          <FiCalendar className="size-3 text-[#FF355E]" />
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "TBA"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div className="space-y-3">
                        {/* Format and Type Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                          {event.eventType === "online" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-300">
                              <FiGlobe className="size-3" /> Online {event.platform ? `(${event.platform})` : ""}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                              <FiMapPin className="size-3 text-[#FF355E]" /> {event.venue || "Campus Offline"}
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                            {event.registrationType === "team" ? (
                              <>
                                <FiUsers className="size-3 text-blue-400" /> Team
                              </>
                            ) : (
                              <>
                                <FiUser className="size-3 text-emerald-400" /> Solo
                              </>
                            )}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white tracking-tight leading-snug line-clamp-1 group-hover:text-white transition-colors">
                          {event.title}
                        </h3>

                        {/* Description snippet */}
                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                        <Link
                          href={`/events/${event.slug || event._id}`}
                          className={`flex-1 py-2.5 px-4 rounded-xl text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all ${
                            isLive
                              ? "bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.35)]"
                              : isPast
                              ? "bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium"
                              : "bg-white text-slate-900 hover:bg-slate-200 font-semibold shadow-sm"
                          }`}
                        >
                          <span>
                            {isLive
                              ? "Join Live Event"
                              : isPast
                              ? "View Archive & Details"
                              : "Explore & Register"}
                          </span>
                          <FiArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : loadingLive ? (
            <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#121626] space-y-3">
              <FiLoader className="size-8 text-[#FF355E] animate-spin mx-auto" />
              <p className="text-sm font-mono text-slate-300">Fetching latest events...</p>
              <p className="text-xs font-mono text-slate-500">Connecting to live database schedule...</p>
            </div>
          ) : (
            <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#121626] space-y-3">
              <FiCalendar className="size-10 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-300">No events found</p>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No events matched your search or category filter. Try clearing filters to see all competitions.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
