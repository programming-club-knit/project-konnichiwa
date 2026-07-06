"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";

import { NAV } from "@/components/landing/landing-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="PTSC logo" width={32} height={32} className="size-8 object-contain" priority />
          <span className="text-[15px] font-semibold tracking-tight">
            PTSC<span className="text-muted-foreground font-normal"> · KNIT</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            size="sm"
            className="bg-gradient-to-r from-brand to-brand-3 text-white hover:opacity-90"
            nativeButton={false}
            render={<a href="/#join" />}
          >
            Join the club <FiArrowRight className="size-4" />
          </Button>
        </div>

        <button
          className="grid size-9 place-items-center rounded-lg border border-white/10 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/#join"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-gradient-to-r from-brand to-brand-3 px-3 py-2.5 text-center text-sm font-medium text-white"
            >
              Join the club
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
