"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiArrowRight, FiLogOut, FiMenu, FiUser, FiX } from "react-icons/fi";

import { NAV } from "@/components/landing/landing-data";

interface AuthUser {
  _id: string;
  username?: string;
  firstName?: string;
  role?: string;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  }

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

        <div className="hidden items-center gap-2.5 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground">
                <FiUser className="size-3.5 text-brand-2" />
                {user.username || user.firstName || "Member"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLogout}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive"
                title="Log out"
              >
                <FiLogOut className="size-3.5" />
              </Button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          )}

          <Button
            size="sm"
            className="bg-brand text-white hover:bg-brand/90"
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

            <div className="my-2 border-t border-white/5 pt-2">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <FiUser className="size-4 text-brand-2" />
                    {user.username || user.firstName || "Member"}
                  </span>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <FiLogOut className="size-3.5" /> Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  Sign in
                </Link>
              )}
            </div>

            <a
              href="/#join"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-brand/90"
            >
              Join the club
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
