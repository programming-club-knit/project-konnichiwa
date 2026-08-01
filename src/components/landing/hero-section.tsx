import { Button } from "@/components/ui/button";
import { Highlighter } from "@/components/ui/highlighter";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import DarkVeil from "./DarkVeil";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 md:pt-48 md:pb-24">
      <div className="absolute inset-0 h-150 w-full overflow-hidden">
        <DarkVeil
          hueShift={250}
          noiseIntensity={0.05}
          scanlineIntensity={0}
          speed={0.9}
          scanlineFrequency={1.2}
          warpAmount={0.3}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto grid h-full max-w-7xl grid-cols-5 border-x border-dashed border-white/5 px-6 lg:px-12">
          <div className="h-full border-r border-dashed border-white/5" />
          <div className="h-full border-r border-dashed border-white/5" />
          <div className="h-full border-r border-dashed border-white/5" />
          <div className="h-full border-r border-dashed border-white/5" />
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
              <span className="text-pink-primary">build.</span>
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
