"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { NAV } from "@/components/landing/landing-data";
import { Highlighter } from "@/components/ui/highlighter";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin') return null;
    return (
      <header className="absolute top-0 inset-x-0 z-50 bg-transparent">
        <nav className="mx-auto flex h-24 max-w-7xl items-center px-6 lg:px-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#8C93B0] transition-all group-hover:border-[#FF355E]/50 group-hover:bg-[#FF355E]/10 group-hover:text-white">
              <FiArrowLeft className="size-5" />
            </div>
            <span className="font-sans font-medium text-sm text-[#8C93B0] transition-colors group-hover:text-white">
              Back to Home
            </span>
          </Link>
        </nav>
      </header>
    );
  }

  return (
    <header className="absolute top-0 inset-x-0 z-50 bg-transparent">
      <nav className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* PTSC Brand Logo */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image
            src="/logo.png"
            alt="PTSC logo"
            width={34}
            height={34}
            className="size-8.5 object-contain"
            priority
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

        {/* PTSC Header Nav Links */}
        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-white font-bold" : "text-[#8C93B0] hover:text-white"
                }`}
              >
                {item.label === "Hire Us" ? (
                  <Highlighter action="underline" color="#FF355E" strokeWidth={3}>
                    <span className={active ? "text-white font-bold" : "text-[#C4C9E2] font-bold"}>
                      {item.label}
                    </span>
                  </Highlighter>
                ) : (
                  item.label
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/#join"
            className="playgame-btn-pink inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg"
          >
            Join the club <FiArrowRight className="size-4" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-white/10 bg-[#0B0D19]/95 backdrop-blur-xl px-6 py-6 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-white font-bold border-l-2 border-[#FF355E]"
                      : "text-[#C4C9E2] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label === "Hire Us" ? (
                    <Highlighter action="underline" color="#FF355E" strokeWidth={3}>
                      <span className="font-bold">{item.label}</span>
                    </Highlighter>
                  ) : (
                    item.label
                  )}
                </Link>
              );
            })}
            <a
              href="/#join"
              onClick={() => setOpen(false)}
              className="playgame-btn-pink mt-3 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-bold text-white shadow-lg"
            >
              Join the club <FiArrowRight className="size-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


