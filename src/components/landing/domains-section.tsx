import { FiChevronRight } from "react-icons/fi";
import { SectionHeader } from "./section-header";
import { DOMAINS } from "./landing-data";

export function DomainsSection() {
  return (
    <section id="domains" className="relative bg-[#0B0D19] py-24">
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
          eyebrow="Domains & Tracks"
          title="Find Your Track"
          desc="Six focus areas, one community. Dive deep into what excites you the most."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => (
            <div
              key={domain.name}
              className="playgame-card group flex flex-col justify-between rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <div>
                <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#FF355E]/20 to-[#FFB800]/20 text-[#FF355E] border border-white/10 group-hover:border-[#FF355E]/50 transition-colors">
                  <domain.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white tracking-tight">
                  {domain.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8C93B0]">
                  {domain.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5">
                <a
                  href="/#join"
                  className="playgame-gold-link inline-flex items-center gap-1 text-sm font-semibold group-hover:translate-x-1 transition-transform"
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