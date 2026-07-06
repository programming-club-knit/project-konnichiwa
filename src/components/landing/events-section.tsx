import { FiArrowRight } from "react-icons/fi";

import { SectionHeader } from "./section-header";
import { EVENTS } from "./landing-data";

export function EventsSection() {
  return (
    <section id="events" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeader
        eyebrow="Events"
        title="Something happening every week"
        desc="Contests, bootcamps, talks and our flagship hackathon — there's always a reason to show up."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {EVENTS.map((event) => (
          <div key={event.title} className="ptsc-card group rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand ring-1 ring-brand/20">
                {event.tag}
              </span>
              <span className="text-xs text-muted-foreground">{event.date}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{event.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {event.desc}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-2 opacity-0 transition-opacity group-hover:opacity-100">
              Learn more <FiArrowRight className="size-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}