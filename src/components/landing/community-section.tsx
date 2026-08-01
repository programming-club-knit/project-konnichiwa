import { FiUsers, FiZap } from "react-icons/fi";
import { LuSparkles, LuTrophy } from "react-icons/lu";

export function CommunitySection() {
  return (
    <section id="community" className="relative bg-[#0B0D19] py-24">
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
        <div className="playgame-card relative overflow-hidden rounded-3xl p-10 md:p-16 border border-white/10">
          <LuSparkles className="size-10 text-[#FFB800]" />
          <blockquote className="mt-6 max-w-3xl text-2xl font-bold leading-snug tracking-tight text-white md:text-3xl font-sans">
            &ldquo;You don&apos;t need to be the smartest in the room — you need
            the <span className="text-[#FF355E]">right room</span>. PTSC is
            that room for anyone at KNIT who wants to build a career in tech.&rdquo;
          </blockquote>
          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-white/5 pt-6">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#8C93B0]">
              <FiUsers className="size-5 text-[#FF355E]" /> Peer-led Mentorship
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#8C93B0]">
              <FiZap className="size-5 text-[#FFB800]" /> Hands-on Projects
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#8C93B0]">
              <LuTrophy className="size-5 text-[#FF355E]" /> Culture of Excellence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}