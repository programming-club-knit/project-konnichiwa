"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { NAV } from "@/components/landing/landing-data";
import { Highlighter } from "@/components/ui/highlighter";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let isMounted = true;
    fetch("/api/user/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data?.success && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Hide the global site header on admin and standalone auth pages (they have their own top nav / back button)
  if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="absolute top-0 inset-x-0 z-50 bg-transparent font-sans">
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

        {/* Sleek Pill Avatar Button if Logged In, else Join Club */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full border border-white/15 bg-[#121528]/80 hover:bg-[#1A1D36] hover:border-[#FF355E]/50 transition-all duration-300 shadow-lg group backdrop-blur-md"
            >
              <div className="relative size-8 rounded-full overflow-hidden border-2 border-[#FF355E]/60 text-[#FF355E] bg-[#FF355E]/15 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                {user.imageSrc ? (
                  <img
                    src={user.imageSrc}
                    alt={user.firstName || "Profile"}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[11px] font-black uppercase">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-xs font-bold text-white group-hover:text-[#FF355E] transition-colors">
                  {user.firstName}
                </span>
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </Link>
          ) : (
            <Link
              href="/register"
              className="playgame-btn-pink inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg"
            >
              Join the club <FiArrowRight className="size-4" />
            </Link>
          )}
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
        <div className="border-t border-white/10 bg-[#0B0D19]/95 backdrop-blur-xl px-6 py-6 md:hidden font-sans">
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

            {user ? (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3.5 rounded-2xl p-3 bg-[#121528] border border-white/15 text-white font-bold mt-2 shadow-lg"
              >
                <div className="relative size-10 rounded-full overflow-hidden border-2 border-[#FF355E]/60 text-[#FF355E] bg-[#FF355E]/15 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                  {user.imageSrc ? (
                    <img src={user.imageSrc} alt={user.firstName} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xs font-black uppercase">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    {user.firstName} {user.lastName}
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </span>
                  <span className="text-[11px] text-[#FF355E] font-medium">View My Profile</span>
                </div>
              </Link>
            ) : (
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="playgame-btn-pink mt-3 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-center text-sm font-bold text-white shadow-lg"
              >
                Join the club <FiArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
