import { FiArrowRight, FiGithub, FiPlay } from "react-icons/fi";

export function JoinSection() {
  return (
    <section id="join" className="relative bg-[#0B0D19] py-24">
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
        <div className="playgame-card relative overflow-hidden rounded-3xl px-8 py-16 text-center md:py-24 border border-white/10 shadow-2xl">
          <div className="playgame-glow-left absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 opacity-50 blur-3xl" />
          <h2 className="font-heading mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Ready to Build With Us?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-[#8C93B0] leading-relaxed">
            Membership is open to every student at KNIT Sultanpur — no
            experience required. Just bring your passion and curiosity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="playgame-btn-pink inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-xl"
            >
              <FiPlay className="size-4 fill-current" /> Join PTSC Now
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="playgame-btn-outline inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold text-white"
            >
              <FiGithub className="size-5" /> Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}