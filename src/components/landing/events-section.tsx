import { FiChevronRight } from "react-icons/fi";
import { SectionHeader } from "./section-header";
import { EVENTS } from "./landing-data";

export function EventsSection() {
  return (
    <section id="events" className="relative bg-[#0B0D19] py-24">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Tournaments & Events"
          title="Something Happening Every Week"
          desc="Contests, bootcamps, talks and our flagship hackathon — there's always a reason to show up and compete."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {EVENTS.map((event) => (
            <div
              key={event.title}
              className="playgame-card group rounded-2xl p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#FF355E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#FF355E]/30">
                    {event.tag}
                  </span>
                  <span className="text-xs font-semibold text-[#8C93B0]">
                    {event.date}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">
                  {event.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8C93B0]">
                  {event.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <a
                  href="/events"
                  className="playgame-gold-link inline-flex items-center gap-1.5 text-sm font-semibold group-hover:translate-x-1 transition-transform"
                >
                  Learn More
                  <FiChevronRight className="size-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}