import { Button } from "@/components/ui/button";
import { FiArrowRight, FiCalendar, FiTerminal } from "react-icons/fi";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

import { STATS } from "./landing-data";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-45">
        <FlickeringGrid
          className="h-full w-full"
          color="rgb(129, 140, 248)"
          squareSize={5}
          gridGap={8}
          maxOpacity={0.1}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="ptsc-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-2 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-brand-2" />
              </span>
              Programming &amp; Tech Skills Club · KNIT Sultanpur
            </div>

            <h1 className="font-heading mt-6 max-w-xl text-4xl font-semibold leading-[0.98] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              We are PTSC.
              <br />
              <span className="ptsc-gradient-text">We build.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Student-run programming community from KNIT Sultanpur. We learn,
              build and compete together.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-11 bg-linear-to-r from-brand to-brand-3 px-5 text-white shadow-lg shadow-brand/25 hover:opacity-90"
                nativeButton={false}
                render={<a href="#join" />}
              >
                Become a member <FiArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/15 px-5"
                nativeButton={false}
                render={<a href="#events" />}
              >
                <FiCalendar className="size-4" /> Explore events
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>

          <div className="ptsc-reveal ptsc-float [animation-delay:120ms]">
            <div className="ptsc-card overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
                <span className="size-3 rounded-full bg-red-400/80" />
                <span className="size-3 rounded-full bg-yellow-400/80" />
                <span className="size-3 rounded-full bg-green-400/80" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  ptsc.club ~ join.ts
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                <span className="text-brand-3">const</span> <span className="text-brand-2">you</span> = <span className="text-muted-foreground">await</span> ptsc.<span className="text-brand">join</span>({"{"}
                {"\n"}  <span className="text-muted-foreground">interests</span>: [<span className="text-green-400">&quot;dsa&quot;</span>, <span className="text-green-400">&quot;web&quot;</span>, <span className="text-green-400">&quot;ai&quot;</span>],
                {"\n"}  <span className="text-muted-foreground">level</span>: <span className="text-green-400">&quot;curious&quot;</span>,
                {"\n"}  <span className="text-muted-foreground">weekends</span>: <span className="text-brand-3">true</span>,
                {"\n"}{"}"});
                {"\n"}
                {"\n"}<span className="text-muted-foreground">// → </span><span className="text-brand-2">building cool things</span> <span className="ptsc-blink">▋</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}