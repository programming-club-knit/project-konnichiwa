import { Button } from "@/components/ui/button";
import { FiArrowRight, FiGithub } from "react-icons/fi";

export function JoinSection() {
  return (
    <section id="join" className="mx-auto max-w-6xl px-5 pb-24">
      <div className="ptsc-card relative overflow-hidden rounded-3xl px-8 py-16 text-center md:py-20">
        <div className="ptsc-glow absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 opacity-40 blur-2xl" />
        <h2 className="font-heading mx-auto max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to write your first line with us?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Membership is open to every student at KNIT Sultanpur — no
          experience required. Just bring the curiosity.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="h-11 bg-gradient-to-r from-brand to-brand-3 px-6 text-white shadow-lg shadow-brand/25 hover:opacity-90"
            nativeButton={false}
            render={<a href="#" />}
          >
            Join PTSC now <FiArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 border-white/15 px-6"
            nativeButton={false}
            render={<a href="https://github.com" />}
          >
            <FiGithub className="size-4" /> Star us on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}