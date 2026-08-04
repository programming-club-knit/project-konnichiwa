import Image from "next/image";
import Link from "next/link";
import {
  FiArrowLeft, FiCalendar, FiClock, FiLink,
  FiMapPin, FiCheckCircle, FiExternalLink
} from "react-icons/fi";
import type { EventItem } from "@/lib/events";

interface EventDetailContentProps {
  event: EventItem & {
    teamMinSize?: number;
    teamMaxSize?: number;
    whatsappGroupLink?: string;
    googleFormLink?: string;
  };
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const isUpcoming = event.status === "upcoming" || event.status === "ongoing";

  return (
    <div className="min-h-screen bg-[#0B0D19] text-white pt-24 pb-16 selection:bg-[#FF355E]/30">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-8">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8C93B0] hover:text-white mb-8 transition-colors"
        >
          <FiArrowLeft className="size-4" /> Back to Events
        </Link>

        {/* Cover Image Banner */}
        {event.coverImageUrl && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Event Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold font-mono uppercase tracking-wider bg-[#FF355E] text-white">
              {event.status}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider bg-white/10 border border-white/10 text-white/80">
              {event.registrationType === "team"
                ? `Team (${event.teamMinSize ?? 1}–${event.teamMaxSize ?? 4} Members)`
                : "Individual"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 pt-2 text-sm text-[#8C93B0] font-mono">
            {event.date && (
              <span className="flex items-center gap-2">
                <FiCalendar className="size-4 text-[#FF355E]" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            )}
            {event.time && (
              <span className="flex items-center gap-2">
                <FiClock className="size-4 text-[#FF355E]" />
                {event.time}
              </span>
            )}
            <span className="flex items-center gap-2">
              <FiMapPin className="size-4 text-[#FF355E]" />
              KNIT Sultanpur Campus
            </span>
          </div>
        </div>

        {/* Content + Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-8">
          {/* Main Description & Resources */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-white mb-3">About the Event</h2>
              <div className="text-sm text-[#8C93B0] leading-relaxed whitespace-pre-line space-y-4">
                {event.description}
              </div>
            </div>

            {event.ruleBookUrl && (
              <div className="p-4 border border-white/10 rounded-xl bg-[#121528] flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono uppercase">Official Rule Book</h3>
                  <p className="text-xs text-[#8C93B0] mt-0.5">Read event rules, guidelines, and scoring criteria.</p>
                </div>
                <a
                  href={event.ruleBookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all shrink-0"
                >
                  View PDF <FiExternalLink className="size-3.5" />
                </a>
              </div>
            )}

            {Array.isArray(event.resources) && event.resources.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-sm font-bold text-white">Event Resources & Problem Sets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-white/10 rounded-xl bg-[#121528] hover:border-white/20 transition-all flex items-center justify-between group"
                    >
                      <span className="text-xs font-mono font-medium text-white group-hover:text-[#FF355E] transition-colors">
                        {res.label || `Resource #${idx + 1}`}
                      </span>
                      <FiLink className="size-3.5 text-white/40 group-hover:text-[#FF355E] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Registration Sidebar */}
          <div className="space-y-6">
            <div className="p-6 border border-white/10 rounded-2xl bg-[#121528] space-y-5 sticky top-28 shadow-xl">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Registration Info
              </h3>

              <div className="space-y-3 text-xs text-[#8C93B0] font-mono">
                <div className="flex justify-between">
                  <span>Entry Fee:</span>
                  <span className="text-emerald-400 font-bold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="text-white font-medium uppercase">{event.registrationType || "Individual"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-white font-medium capitalize">{event.status}</span>
                </div>
              </div>

              {isUpcoming ? (
                <div className="space-y-3 pt-2">
                  {event.googleFormLink ? (
                    <a
                      href={event.googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#FF355E] hover:bg-[#FF4D70] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF355E]/20 flex items-center justify-center gap-2"
                    >
                      Register Now <FiExternalLink className="size-4" />
                    </a>
                  ) : (
                    <div className="w-full py-3 bg-[#FF355E]/20 border border-[#FF355E]/30 text-[#FF355E] font-mono font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2">
                      <FiCheckCircle className="size-4" /> Registration Opening Soon
                    </div>
                  )}

                  {event.whatsappGroupLink && (
                    <a
                      href={event.whatsappGroupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      Join WhatsApp Group
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center font-mono text-xs text-white/50">
                  This event has concluded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
