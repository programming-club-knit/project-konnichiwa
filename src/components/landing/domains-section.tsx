import { FiArrowRight } from "react-icons/fi";

import { SectionHeader } from "./section-header";
import { DOMAINS } from "./landing-data";

export function DomainsSection() {
  return (
    <section id="domains" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeader
        eyebrow="Domains"
        title="Find your track"
        desc="Six focus areas, one community. Dive deep into what excites you the most."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOMAINS.map((domain) => (
          <div
            key={domain.name}
            className="ptsc-card group flex items-start gap-4 rounded-2xl p-5"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand/20 to-brand-3/20 text-brand-2 ring-1 ring-white/10">
              <domain.icon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-medium">
                {domain.name}
                <FiArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{domain.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}