import { FiArrowRight, FiImage } from "react-icons/fi";

export function UpcomingEventSection() {
  return (
    <section id="upcoming-event" className="relative bg-[#0B0D19] py-24 border-b border-white/5 overflow-hidden">
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
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Image Card with Decorative Dot Matrix Accent */}
          <div className="relative lg:col-span-5">
            {/* Bottom-Left Decorative Dot Matrix Pattern */}
            <div className="absolute -bottom-6 -left-6 z-0 grid grid-cols-6 gap-2.5 opacity-30">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={`dot-${i}`} className="size-1.5 rounded-full bg-white/40" />
              ))}
            </div>

            {/* Poster / Placeholder Card */}
            <div className="relative z-10 aspect-[4/4] sm:aspect-[4/3] lg:aspect-[4/4] w-full overflow-hidden rounded-3xl bg-[#131627] border border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-2xl group hover:border-[#FF355E]/40 transition-all duration-300">
              <div className="flex flex-col items-center justify-center gap-3 text-[#8C93B0] group-hover:text-white transition-colors">
                <div className="grid size-16 place-items-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#FF355E]/10 group-hover:border-[#FF355E]/40 transition-colors">
                  <FiImage className="size-8 text-[#FF355E]" />
                </div>
                <span className="text-sm font-bold tracking-wider uppercase mt-2 text-white">
                  Event Banner Placeholder
                </span>
                <span className="text-xs font-mono text-[#8C93B0]/80">
                  Replace with event image
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Event Details & Content */}
          <div className="lg:col-span-7 flex flex-col justify-center pl-0 lg:pl-4">
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans leading-tight">
              CodeStorm &apos;26 — Annual Tech Summit
            </h2>

            {/* Description */}
            <p className="mt-5 text-base leading-relaxed text-[#8C93B0] max-w-xl">
              We provide a wide range of hackathon tracks, hands-on workshop experiences, and project challenges completely tailored to accelerate your developer journey at KNIT.
            </p>

            {/* Two Detail Columns */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Great Speakers
                </h3>
                <p className="mt-1.5 text-sm text-[#8C93B0] leading-normal">
                  Senior engineers, founders, and industry leaders share insights and guidance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  300+ Participants
                </h3>
                <p className="mt-1.5 text-sm text-[#8C93B0] leading-normal">
                  Over 300 student developers competing live across multiple domain tracks.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10">
              <a
                href="#register"
                className="inline-flex items-center justify-center rounded-full bg-[#FF355E] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#FF355E]/25 hover:bg-[#FF4D70] hover:shadow-[#FF355E]/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 gap-2 group"
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
