import { FiArrowRight, FiCalendar, FiMapPin, FiUsers, FiImage } from "react-icons/fi";

export function UpcomingEventSection() {
  return (
    <section id="upcoming-event" className="relative bg-[#0B0D19] py-16 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-8 lg:gap-12 items-stretch">

          {/* Left: Poster Placeholder */}
          <div className="relative min-h-[360px] lg:min-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-[#121528] flex flex-col items-center justify-center group">
            {/* Placeholder content — replace inner content with <Image> when poster is ready */}
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <div className="grid size-20 place-items-center rounded-2xl bg-white/5 border border-dashed border-white/20 group-hover:bg-[#FF355E]/5 group-hover:border-[#FF355E]/30 transition-all duration-300">
                <FiImage className="size-9 text-white/20 group-hover:text-[#FF355E]/50 transition-colors duration-300" />
              </div>
              <p className="text-xs font-mono text-white/20 uppercase tracking-widest leading-relaxed group-hover:text-white/30 transition-colors">
                Event Poster<br />Placeholder
              </p>
            </div>

            {/* Corner badge */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[#FF355E]/10 border border-[#FF355E]/20 px-3 py-1">
              <span className="size-1.5 rounded-full bg-[#FF355E] animate-pulse" />
              <span className="text-[10px] font-black text-[#FF355E] uppercase tracking-widest">Live Soon</span>
            </div>
          </div>

          {/* Right: Event Details */}
          <div className="flex flex-col justify-center gap-6">

            {/* Label */}
            <p className="text-xs font-mono font-bold text-[#8C93B0] uppercase tracking-widest">
              Currently Upcoming
            </p>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.1]">
              CodeStorm &apos;26 —{" "}
              <span className="text-[#FF355E]">Annual Tech Summit</span>
            </h2>

            {/* Description */}
            <p className="text-base text-[#8C93B0] leading-relaxed max-w-lg">
              Hackathon tracks, hands-on workshops, and project challenges crafted to push the limits of what student developers can build in 24 hours.
            </p>

            {/* Meta */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-sm font-medium text-white/70">
                <FiCalendar className="size-4 text-[#FF355E] shrink-0" />
                September 12–13, 2026
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-white/70">
                <FiMapPin className="size-4 text-[#FF355E] shrink-0" />
                KNIT Auditorium, Sultanpur
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-white/70">
                <FiUsers className="size-4 text-[#FF355E] shrink-0" />
                300+ Participants Expected
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-2 border-t border-white/10">
              {[
                { value: "24h", label: "Hackathon" },
                { value: "₹50K", label: "Prize Pool" },
                { value: "8+", label: "Tracks" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <a
                href="#register"
                className="inline-flex items-center gap-2 rounded-full bg-[#FF355E] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#FF355E]/20 hover:bg-[#FF4D70] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 group"
              >
                Register Now <FiArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>

  );
}



