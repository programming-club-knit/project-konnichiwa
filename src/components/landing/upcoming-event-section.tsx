import { FiCalendar, FiClock, FiMapPin, FiArrowRight, FiImage, FiZap } from "react-icons/fi";

export function UpcomingEventSection() {
  return (
    <section id="upcoming-event" className="relative bg-[#0B0D19] py-20 border-b border-white/5">
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
        {/* Section Tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FF355E] opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#FF355E]" />
          </span>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFB800]">
            Next Upcoming Event
          </span>
        </div>

        {/* Featured Upcoming Event Card Container */}
        <div className="playgame-card overflow-hidden rounded-3xl border border-white/10 p-7 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Left: Photo Placeholder slot for Event Banner */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#16192C] border border-white/10 flex flex-col items-center justify-center p-6 text-center group hover:border-[#FF355E]/40 transition-colors">
                <div className="flex flex-col items-center justify-center gap-2 text-[#8C93B0] group-hover:text-white transition-colors">
                  <div className="grid size-12 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#FF355E]/10 group-hover:border-[#FF355E]/40 transition-colors">
                    <FiImage className="size-6 text-[#FF355E]" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide uppercase mt-1">
                    Upcoming Event Poster Placeholder
                  </span>
                  <span className="text-[11px] font-mono text-[#8C93B0]">
                    /images/upcoming-event.jpg
                  </span>
                </div>

                <div className="absolute top-4 left-4 rounded-lg bg-[#FF355E] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
                  Flagship Hackathon
                </div>
              </div>
            </div>

            {/* Right: Event Information & Registration Details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#8C93B0] mb-3">
                  <span className="flex items-center gap-1.5 text-white">
                    <FiCalendar className="size-4 text-[#FF355E]" /> Aug 15–17, 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="size-4 text-[#FFB800]" /> 09:00 AM IST
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="size-4 text-[#FF355E]" /> KNIT Campus Auditorium
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                  CodeStorm &apos;26 — 36-Hour Build Sprint
                </h2>

                <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#8C93B0]">
                  Join over 300+ student developers for PTSC&apos;s annual overnight hackathon. Build innovative prototypes, solve real-world tracks, win cash prizes, and get mentored by seniors and alumni engineers.
                </p>

                {/* Countdown metrics preview */}
                <div className="mt-6 grid grid-cols-4 gap-3 max-w-md text-center">
                  <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
                    <div className="text-xl font-extrabold text-white">14</div>
                    <div className="text-[10px] font-medium uppercase text-[#8C93B0]">Days</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
                    <div className="text-xl font-extrabold text-white">08</div>
                    <div className="text-[10px] font-medium uppercase text-[#8C93B0]">Hours</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
                    <div className="text-xl font-extrabold text-white">45</div>
                    <div className="text-[10px] font-medium uppercase text-[#8C93B0]">Mins</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
                    <div className="text-xl font-extrabold text-white">12</div>
                    <div className="text-[10px] font-medium uppercase text-[#8C93B0]">Secs</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#register"
                  className="playgame-btn-pink inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl"
                >
                  <FiZap className="size-4" /> Register For Event
                </a>
                <a
                  href="/events"
                  className="playgame-btn-outline inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm sm:text-base font-bold text-white"
                >
                  View Details <FiArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
