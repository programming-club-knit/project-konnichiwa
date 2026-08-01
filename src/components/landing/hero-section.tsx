import { Button } from "@/components/ui/button";
import { GlyphMatrix } from "@/components/ui/glyph-matrix";
import { Highlighter } from "@/components/ui/highlighter";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B0D19] pt-36 pb-16 sm:pt-44 md:pt-48 md:pb-24">
      {/* GlyphMatrix Background Component */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <GlyphMatrix color="#8C93B0" cellSize={16} fadeBottom={0.85} />
      </div>

      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* PTSC Main Headline with Magic UI Highlighter Underline */}
        <div className="relative inline-block mx-auto">
          <h1 className="max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] font-sans md:mt-8">
            We are{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              PTSC.
            </Highlighter>{" "}
            <br />
            We{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-[#FF355E]">build.</span>
            </Highlighter>
          </h1>
        </div>

        {/* Ultra-Sleek Clean CTA Buttons */}
        <div className="mt-20 sm:mt-28 md:mt-32 flex flex-wrap items-center justify-center gap-8">
          <Button
            variant="sleekClean"
            nativeButton={false}
            render={<a href="#join" />}
          >
            Become a Member{" "}
            <FiArrowRight className="size-4.5 transition-transform group-hover/button:translate-x-1.5" />
          </Button>
          <Button
            variant="sleekCleanMuted"
            nativeButton={false}
            render={<a href="#events" />}
          >
            <FiCalendar className="size-4.5" /> Explore Events
          </Button>
        </div>
      </div>
    </section>
  );
}