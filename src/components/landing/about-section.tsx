import { SectionHeader } from "./section-header";
import { FEATURES } from "./landing-data";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export function AboutSection() {
  return (
    <section id="about" className="relative bg-[#0B0D19] py-24">
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
          eyebrow="What We Do"
          title="A club for people who love to build & compete"
          desc="Whatever your track, there's a place for you. We learn by doing — shipping projects, cracking problems and helping each other level up."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`playgame-card group rounded-2xl p-7 flex flex-col justify-between ${feature.span}`}
            >
              <div>
                <div className="grid size-12 place-items-center rounded-xl bg-[#FF355E]/15 text-[#FF355E] border border-[#FF355E]/30 transition-transform group-hover:scale-110">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8C93B0]">
                  {feature.body}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href="/#domains"
                  className="playgame-gold-link inline-flex items-center gap-1.5 text-sm font-semibold group-hover:translate-x-1 transition-transform"
                >
                  Learn More
                  <FiChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}