import { FiUsers, FiZap } from "react-icons/fi";
import { LuSparkles, LuTrophy } from "react-icons/lu";

export function CommunitySection() {
  return (
    <section id="community" className="mx-auto max-w-6xl px-5 py-24">
      <div className="ptsc-card relative overflow-hidden rounded-3xl p-10 md:p-16">
        <div className="ptsc-glow absolute -right-20 -top-20 h-72 w-72 opacity-30 blur-2xl" />
        <LuSparkles className="size-8 text-brand-2" />
        <blockquote className="mt-6 max-w-3xl text-2xl font-medium leading-snug tracking-tight md:text-3xl">
          &ldquo;You don&apos;t need to be the smartest in the room — you need
          the <span className="ptsc-gradient-text">right room</span>. PTSC is
          that room for anyone at KNIT who wants to build a career in tech.&rdquo;
        </blockquote>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FiUsers className="size-4 text-brand" /> Peer-led mentorship
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FiZap className="size-4 text-brand-2" /> Hands-on projects
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LuTrophy className="size-4 text-brand-3" /> A culture of winning
          </div>
        </div>
      </div>
    </section>
  );
}