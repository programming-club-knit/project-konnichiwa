import Image from "next/image";
import Link from "next/link";
import { SOCIAL_PLATFORMS } from "@/components/landing/landing-data";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0B0D19] py-12 relative overflow-hidden">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 lg:px-12 md:flex-row">
        {/* PTSC Brand info */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image
            src="/logo.png"
            alt="PTSC logo"
            width={34}
            height={34}
            className="size-8.5 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1">
              PTSC<span className="text-[#FF355E] text-xl font-black">.</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-[#8C93B0] uppercase">
              KNIT Sultanpur
            </span>
          </div>
        </Link>

        {/* Social platform icons */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[#8C93B0]">
          {SOCIAL_PLATFORMS.slice(0, 8).map((platform) => {
            const IconComponent = platform.icon;
            return (
              <a
                key={platform.name}
                href="#"
                className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#8C93B0] transition-all hover:border-[#FF355E]/50 hover:bg-[#FF355E]/10 hover:text-white hover:scale-110"
                title={platform.name}
                aria-label={platform.name}
              >
                <IconComponent className="size-4" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#8C93B0] font-medium">
          © {new Date().getFullYear()} PTSC. Built by students, for students.
        </p>
      </div>
    </footer>
  );
}
