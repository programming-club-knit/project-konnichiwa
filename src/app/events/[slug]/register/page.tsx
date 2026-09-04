import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiUser, 
  FiMessageCircle, 
  FiBookOpen, 
  FiShield 
} from "react-icons/fi";
import { getEventBySlug } from "@/lib/events";
import { getEventDynamicStatus } from "@/lib/event-status";
import { EventRegistrationForm } from "@/components/events/event-registration-form";
import { EventCoverImage } from "@/components/events/event-cover-image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) {
    return { title: "Register | PTSC" };
  }
  return {
    title: `Register: ${event.title} | PTSC KNIT Sultanpur`,
    description: `Official registration form for ${event.title} at KNIT Sultanpur.`,
  };
}

export default async function EventRegisterPage({ params }: Params) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const timing = getEventDynamicStatus(event);
  const isTeam = event.registrationType === "team";

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] pt-24 pb-20 text-slate-200 font-sans selection:bg-[#FF355E]/30">
      {/* Background Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-4">
        {/* Back navigation button */}
        <div className="mb-6">
          <Link
            href={`/events/${event.slug || event._id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <FiArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Event Details</span>
          </Link>
        </div>

        {/* Compact Event Banner Header */}
        <div className="mb-8 rounded-3xl overflow-hidden border border-white/10 bg-[#121626] shadow-xl flex flex-col md:flex-row items-stretch">
          <div className="relative md:w-72 h-44 md:h-auto shrink-0 bg-[#090B14]">
            <EventCoverImage
              src={event.coverImageUrl}
              alt={event.title}
              title={event.title}
              variant="spotlight"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF355E]/20 text-[#FF7597] border border-[#FF355E]/30 font-semibold font-mono uppercase tracking-wider text-[10px]">
                {isTeam ? "Team Registration" : "Solo Entry"}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400 font-medium">Free Entry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Register for {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl line-clamp-2">
              {event.description}
            </p>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Registration Form (2 cols) */}
          <div className="lg:col-span-2">
            <EventRegistrationForm event={event as any} />
          </div>

          {/* Sticky Sidebar (1 col) */}
          <div className="space-y-6 lg:sticky lg:top-28">
            {/* Event Specs Card */}
            <div className="p-6 rounded-3xl bg-[#121626] border border-white/10 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
                Event Schedule & Format
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <FiCalendar className="size-3.5 text-[#FF355E]" /> Date:
                  </span>
                  <span className="font-medium text-white">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                  </span>
                </div>

                {event.time && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2 text-slate-400">
                      <FiClock className="size-3.5 text-amber-400" /> Time:
                    </span>
                    <span className="font-medium text-white">{event.time}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    {isTeam ? <FiUsers className="size-3.5 text-blue-400" /> : <FiUser className="size-3.5 text-emerald-400" />} Mode:
                  </span>
                  <span className="font-medium text-white capitalize">
                    {event.eventType || "Campus Offline"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <FiShield className="size-3.5 text-emerald-400" /> Eligibility:
                  </span>
                  <span className="font-medium text-emerald-400">KNIT Students</span>
                </div>
              </div>

              {event.ruleBookUrl && (
                <div className="pt-2 border-t border-white/5">
                  <a
                    href={event.ruleBookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <FiBookOpen className="size-3.5 text-[#FF355E]" />
                    <span>Download Official Rulebook</span>
                  </a>
                </div>
              )}
            </div>

            {/* Official WhatsApp Group Card */}
            {event.whatsappGroupLink && (
              <div className="p-6 rounded-3xl bg-[#0F1D17] border border-[#25D366]/30 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <FiMessageCircle className="size-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Official WhatsApp Group
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join the official competition channel for rulebook announcements, problem clarifications, and mentor support.
                </p>
                <a
                  href={event.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20"
                >
                  <FiMessageCircle className="size-4" />
                  <span>Join WhatsApp Community</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
