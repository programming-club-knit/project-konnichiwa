import { SectionHeader } from "./section-header";
import { FEATURES } from "./landing-data";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeader
        eyebrow="What we do"
        title="A club for people who love to build"
        desc="Whatever your track, there's a place for you. We learn by doing — shipping projects, cracking problems and helping each other level up."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={`ptsc-card group rounded-2xl p-6 ${feature.span}`}
          >
            <div className="grid size-11 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-transform group-hover:scale-110">
              <feature.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}