import { MARQUEE } from "./landing-data";

export function MarqueeSection() {
  return (
    <section className="relative border-y border-white/5 py-5">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <div className="ptsc-marquee flex shrink-0 items-center gap-8 pr-8">
          {[...MARQUEE, ...MARQUEE].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="font-mono text-sm text-muted-foreground/70 whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}