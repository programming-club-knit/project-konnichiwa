"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiGlobe,
  FiUsers,
  FiUser,
  FiBookOpen,
  FiMessageCircle,
  FiShare2,
  FiCheck,
  FiExternalLink,
  FiVideo,
  FiFileText,
  FiShield,
  FiAward,
  FiCheckCircle
} from "react-icons/fi";
import { type EventItem, getEventDynamicStatus } from "@/lib/event-status";

interface EventDetailContentProps {
  event: EventItem;
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const [copied, setCopied] = useState(false);

  const timing = getEventDynamicStatus(event);
  const { isPast, isLive, isUpcoming, label, isRegistrationClosed } = timing;
  const isOnline = event.eventType === "online";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(`Check out "${event.title}" organized by PTSC KNIT Sultanpur: ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] text-slate-200 pt-24 pb-20 selection:bg-[#FF355E]/30 font-sans">
      {/* Vertical Dashed Guidelines Overlay matching /people */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg"
          >
            <FiArrowLeft className="size-3.5" /> Back to All Events
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
          >
            {copied ? (
              <>
                <FiCheck className="size-3.5 text-emerald-400" /> Link Copied!
              </>
            ) : (
              <>
                <FiShare2 className="size-3.5" /> Share Event
              </>
            )}
          </button>
        </div>

        {/* Hero Artwork Banner */}
        <div className="relative w-full h-64 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden mb-10 border border-white/15 shadow-2xl bg-[#070913] flex items-center justify-center">
          {event.coverImageUrl ? (
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : (
            <div className="size-full flex flex-col items-center justify-center p-8 text-center bg-[#0B0E1A]">
              <div className="grid size-20 place-items-center rounded-3xl bg-white/5 border border-white/10">
                <FiAward className="size-10 text-[#FF355E]" />
              </div>
              <span className="mt-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                PTSC Flagship Competition
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B14] via-[#090B14]/40 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="flex items-center gap-2">
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 ${
                  isLive
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] backdrop-blur-md"
                    : isPast
                    ? "bg-slate-900/90 border border-white/20 text-slate-300 backdrop-blur-md"
                    : "bg-[#FF355E] text-white"
                }`}
              >
                {isLive && (
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
                {label}
              </span>

              {isOnline ? (
                <span className="px-3 py-1 rounded-full bg-[#090B14]/90 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5">
                  <FiGlobe className="size-3" /> Online {event.platform ? `(${event.platform})` : ""}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-[#090B14]/90 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-medium flex items-center gap-1.5">
                  <FiMapPin className="size-3 text-[#FF355E]" /> {event.venue || "Campus Offline"}
                </span>
              )}
            </div>

            <span className="px-3 py-1 rounded-full bg-[#090B14]/90 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-medium flex items-center gap-1.5">
              {event.registrationType === "team" ? (
                <>
                  <FiUsers className="size-3 text-blue-400" /> Team ({event.teamMinSize || 2}-{event.teamMaxSize || 4} Members)
                </>
              ) : (
                <>
                  <FiUser className="size-3 text-emerald-400" /> Solo Participation
                </>
              )}
            </span>
          </div>

          {/* Floating Hero Title inside banner */}
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>

        {/* 2-Column Content + Registration Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Description & Event Brief */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#121626] border border-white/10">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <FiCalendar className="size-3.5 text-[#FF355E]" /> Date
                </span>
                <p className="text-sm font-semibold text-white">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "TBA"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <FiClock className="size-3.5 text-amber-400" /> Time
                </span>
                <p className="text-sm font-semibold text-white">
                  {event.time || "Schedule TBA"}
                </p>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <FiMapPin className="size-3.5 text-blue-400" /> Location / Arena
                </span>
                <p className="text-sm font-semibold text-white truncate">
                  {isOnline ? (event.platform || "Virtual Arena") : (event.venue || "KNIT Sultanpur Campus")}
                </p>
              </div>
            </div>

            {/* About Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#FF355E]" />
                <span>About the Event</span>
              </h2>

              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-sans">
                {event.description || "Details for this event will be published shortly."}
              </div>
            </div>

            {/* Official Rule Book Card */}
            {event.ruleBookUrl && (
              <div className="p-6 rounded-3xl bg-[#121626] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#FF355E] flex items-center gap-1.5">
                    <FiShield className="size-3.5" /> Official Competition Guide
                  </span>
                  <h3 className="text-base font-bold text-white">Rulebook & Evaluation Criteria</h3>
                  <p className="text-xs text-slate-400">Review full scoring metrics, submission formats, and judging rubrics.</p>
                </div>

                <a
                  href={event.ruleBookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all shrink-0 shadow-md"
                >
                  <FiBookOpen className="size-4" /> Open Rulebook <FiExternalLink className="size-3.5" />
                </a>
              </div>
            )}

            {/* Resources & Attachments */}
            {Array.isArray(event.resources) && event.resources.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121626] border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <FiFileText className="size-4 text-blue-400" />
                  <span>Resources & Reference Materials</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border border-white/10 hover:border-white/25 rounded-2xl bg-[#090B14] transition-all flex items-center justify-between group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-[#FF355E] transition-colors">
                        {res.label || `Resource Document #${idx + 1}`}
                      </span>
                      <FiExternalLink className="size-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action & Registration Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/15 shadow-2xl space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-bold text-white">Registration Hub</h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1.5 ${
                      isPast
                        ? "bg-white/10 text-slate-400"
                        : isRegistrationClosed
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : isLive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {isLive && !isRegistrationClosed && (
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                    {isPast
                      ? "Archived"
                      : isRegistrationClosed
                      ? "Registration Closed"
                      : isLive
                      ? "Happening Now"
                      : "Open for Entries"}
                  </span>
                </div>
              </div>

              {/* Deadline Badge if present */}
              {event.registrationDeadline && !isPast && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                    isRegistrationClosed
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-[#0f0f0f] border-amber-500/30 text-amber-300"
                  }`}
                >
                  <FiClock
                    className={`size-4 shrink-0 mt-0.5 ${
                      isRegistrationClosed ? "text-red-400" : "text-amber-400 animate-pulse"
                    }`}
                  />
                  <div>
                    <span
                      className={`block font-semibold text-xs ${
                        isRegistrationClosed ? "text-red-400" : "text-amber-400"
                      }`}
                    >
                      {isRegistrationClosed ? "Registration Closed" : "Registration Deadline"}
                    </span>
                    <span className={isRegistrationClosed ? "text-red-200/90" : "text-amber-200"}>
                      {isRegistrationClosed ? "Deadline passed on " : "Closes: "}
                      {new Date(event.registrationDeadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Specification Table */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Participation Fee:</span>
                  <span className="text-emerald-400 font-semibold">100% Free</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Team Structure:</span>
                  <span className="text-white font-medium">
                    {event.registrationType === "team" 
                      ? `${event.teamMinSize || 2} - ${event.teamMaxSize || 4} Members`
                      : "Individual Entry"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Mode:</span>
                  <span className="text-white font-medium capitalize">
                    {event.eventType || "Offline Campus"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Eligibility:</span>
                  <span className="text-slate-200 font-medium">All KNIT Students</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {isPast ? (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-1">
                    <span className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Event Concluded
                    </span>
                    <p className="text-xs text-slate-500">
                      This competition has concluded. Check back for upcoming events.
                    </p>
                  </div>
                ) : isRegistrationClosed ? (
                  <>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-1">
                      <span className="block text-xs font-semibold text-red-400 uppercase tracking-wide">
                        Registration Closed
                      </span>
                      <p className="text-xs text-red-300/80">
                        The registration deadline for this event has passed.
                      </p>
                    </div>

                    {/* Virtual Meeting Join Link */}
                    {isOnline && event.meetLink && (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <FiVideo className="size-4 text-cyan-400" />
                        <span>Join Live Virtual Room</span>
                      </a>
                    )}

                    {/* WhatsApp Updates Community */}
                    {event.whatsappGroupLink && (
                      <a
                        href={event.whatsappGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <FiMessageCircle className="size-4" />
                        <span>Join Official WhatsApp Group</span>
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    {event.googleFormLink ? (
                      <a
                        href={event.googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 bg-[#FF355E] hover:bg-[#FF4D70] text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-[#FF355E]/20 flex items-center justify-center gap-2 text-center"
                      >
                        Register for Event <FiExternalLink className="size-4" />
                      </a>
                    ) : (
                      <div className="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-slate-300 text-xs rounded-xl flex items-center justify-center gap-2 text-center">
                        <FiCheckCircle className="size-4 text-emerald-400" />
                        <span>Registration Opening Soon</span>
                      </div>
                    )}

                    {/* Virtual Meeting Join Link */}
                    {isOnline && event.meetLink && (
                      <a
                        href={event.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <FiVideo className="size-4 text-cyan-400" />
                        <span>Join Live Virtual Room</span>
                      </a>
                    )}

                    {/* WhatsApp Updates Community */}
                    {event.whatsappGroupLink && (
                      <a
                        href={event.whatsappGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <FiMessageCircle className="size-4" />
                        <span>Join Official WhatsApp Group</span>
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Share & Social Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-medium"
                >
                  <FiMessageCircle className="size-3 text-emerald-400" /> WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-medium"
                >
                  <FiShare2 className="size-3 text-blue-400" /> Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
