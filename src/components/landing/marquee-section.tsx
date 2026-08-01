import { FiGlobe } from "react-icons/fi";

const RIBBON_ITEMS_1 = [
  "BIGGEST HACKATHON",
  "STUDENT RUN",
  "KNIT SULTANPUR",
  "BUILD & COMPETE",
  "500+ MEMBERS",
  "PTSC COMMUNITY",
];

const RIBBON_ITEMS_2 = [
  "STUDENT RUN",
  "COMPETITIVE PROGRAMMING",
  "WEB & APP DEV",
  "OPEN SOURCE",
  "AI / ML TRACKS",
  "PEER MENTORSHIP",
];

export function MarqueeSection() {
  return (
    <section className="relative overflow-hidden bg-[#00000] md:py-24 flex items-center justify-center min-h-[260px]">
      {/* Container with horizontal fade masks to create generous gaps at the left and right ends */}
      <div className="relative w-full flex items-center justify-center min-h-[180px] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        {/* Ribbon 1: Angled Pinkish-Red Strip from Hero Section with Black Overlay */}
        <div className="absolute w-[120%] left-[-10%] top-1/2 -translate-y-1/2 rotate-[-5deg] bg-[#FF355E] py-3.5 z-10 shadow-lg overflow-hidden">
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="flex overflow-hidden relative z-10">
            <div className="ptsc-marquee flex shrink-0 items-center gap-16 pr-16">
              {[...RIBBON_ITEMS_1, ...RIBBON_ITEMS_1, ...RIBBON_ITEMS_1].map((item, index) => (
                <div
                  key={`r1-${item}-${index}`}
                  className="flex items-center gap-4 font-sans text-base sm:text-lg font-black tracking-wider text-white uppercase whitespace-nowrap"
                >
                  <FiGlobe className="size-5 shrink-0 text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ribbon 2: Flat Black Strip with Pinkish Accent Icons */}
        <div className="absolute w-[120%] left-[-10%] top-1/2 -translate-y-1/2 rotate-[0deg] bg-[#000000] border-y border-white/20 py-3.5 z-20 shadow-xl overflow-hidden">
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="flex overflow-hidden relative z-10">
            <div className="ptsc-marquee-reverse flex shrink-0 items-center gap-16 pr-16">
              {[...RIBBON_ITEMS_2, ...RIBBON_ITEMS_2, ...RIBBON_ITEMS_2].map((item, index) => (
                <div
                  key={`r2-${item}-${index}`}
                  className="flex items-center gap-4 font-sans text-base sm:text-lg font-black tracking-wider text-white uppercase whitespace-nowrap"
                >
                  <FiGlobe className="size-5 shrink-0 text-[#FF355E]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}