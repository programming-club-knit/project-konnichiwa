import { SectionHeader } from "./section-header";
import type { EventItem } from "@/lib/event-status";
import Card5 from "@/components/ui/events-card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface EventsSectionProps {
  events: EventItem[];
}

const DEMO_EVENTS: EventItem[] = [
  {
    _id: "demo-1",
    title: "PTSC Codathon 2026",
    description: "Our flagship annual coding contest designed to test your algorithmic, mathematical, and data structure skills. Compete with the best minds on campus!",
    date: "2026-09-15T10:00:00.000Z",
    status: "Upcoming",
    coverImageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200", // Anime style cityscape
    slug: "codathon-2026",
    registrationType: "individual"
  },
  {
    _id: "demo-2",
    title: "Web Development Bootcamp",
    description: "A comprehensive hands-on workshop covering Next.js, TailwindCSS, and backend integration. Build and deploy your first full-stack application.",
    date: "2026-09-22T14:30:00.000Z",
    status: "Upcoming",
    coverImageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800", // Anime/cyberpunk setup
    slug: "web-dev-bootcamp",
    registrationType: "individual"
  },
  {
    _id: "demo-3",
    title: "PTSC In-House Hackathon",
    description: "Collaborate in teams of 2-4 to solve real-world problems over 36 hours. Mentors from the industry will guide you through the process.",
    date: "2026-10-05T09:00:00.000Z",
    status: "Upcoming",
    coverImageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800", // Anime code/neon style
    slug: "inhouse-hackathon",
    registrationType: "team"
  }
];

export function EventsSection({ events }: EventsSectionProps) {
  const displayEvents = events && events.length > 0 ? events : DEMO_EVENTS;
  const featuredEvent = displayEvents[0];
  const regularEvents = displayEvents.slice(1);

  return (
    <section id="events" className="relative bg-transparent py-32 selection:bg-[#F47174]/30 overflow-hidden">
      {/* Decorative Anime Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -left-[20%] top-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F47174]/10 to-transparent blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[10%] w-[40%] h-[60%] rounded-full bg-gradient-to-bl from-[#00F0FF]/10 to-transparent blur-[120px]" />
        {/* Star/Sparkle accents */}
        <div className="absolute top-[15%] right-[20%] text-[#FFB800] opacity-50 animate-pulse text-2xl">✦</div>
        <div className="absolute bottom-[25%] left-[10%] text-[#00F0FF] opacity-40 animate-pulse text-xl delay-300">✦</div>
      </div>

      {/* Grid Guidelines (Subtle) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/10">
          <div className="border-r border-dashed border-white/10 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeader
            eyebrow="Tournaments & Events"
            title="Our Next Adventures"
            desc="Join the squad. Contests, bootcamps, talks and flagship hackathons."
          />
        </div>

        {displayEvents.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Event (Large layout) */}
            {featuredEvent && (
              <div className="group relative overflow-hidden rounded-[2rem] bg-[#140D26]/80 backdrop-blur-md border-2 border-white/10 shadow-2xl shadow-black/50 transition-all duration-700 hover:shadow-[#00F0FF]/20 hover:border-white/20">
                <div className="relative w-full h-[450px] sm:h-[500px] overflow-hidden rounded-[2rem]">
                  {/* Backdrop Gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 pointer-events-none" />
                  <img
                    src={featuredEvent.coverImageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200"}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 z-20 flex gap-3">
                     <span className="rounded-full bg-gradient-to-r from-[#F47174] to-[#FF4D70] px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_4px_15px_rgba(244,113,116,0.4)] border border-white/20 backdrop-blur-md">
                        Featured
                     </span>
                     <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 text-xs font-bold font-mono text-white shadow-lg">
                        {featuredEvent.date ? new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                     </span>
                  </div>

                  {/* Integrated Event Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 z-20 flex flex-col justify-end max-w-3xl">
                    <h3 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight mb-4 group-hover:text-[#00F0FF] transition-colors duration-300 leading-tight">
                      {featuredEvent.title}
                    </h3>
                    <p className="text-[#A0A8C0] text-sm sm:text-base leading-relaxed mb-6 line-clamp-3">
                      {featuredEvent.description}
                    </p>
                    <Link
                      href={`/events/${featuredEvent.slug || featuredEvent._id}`}
                      className={buttonVariants({
                        variant: 'sleek',
                        size: 'lg',
                        className: 'self-start text-center justify-center rounded-2xl shadow-[0_4px_15px_rgba(244,113,116,0.3)] hover:shadow-[0_6px_25px_rgba(244,113,116,0.5)] bg-gradient-to-r from-[#F47174] to-[#FF4D70] border-none text-base px-8 py-6',
                      })}
                    >
                      View Featured Event
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of smaller events */}
            {regularEvents.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {regularEvents.map((event) => (
                  <Card5 key={event._id || event.slug} event={event} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 py-24 text-center text-white/50 font-bold text-sm border-2 border-dashed border-white/10 rounded-[2rem] bg-[#0E101D]/50 backdrop-blur-sm">
            <div className="text-4xl mb-4">✨</div>
            No upcoming events right now. The next arc is coming soon!
          </div>
        )}
      </div>
    </section>
  );
}