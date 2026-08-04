"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiLock, FiMail, FiArrowRight, FiLoader } from 'react-icons/fi';
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      // On success, redirect to the admin dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0B0D19]">
      {/* Vertical Dashed Guidelines Overlay to match UI layout style */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-[#121528] shadow-xl mb-6">
            <Image
              src="/logo.png"
              alt="PTSC logo"
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          </div>
          <h1 className="text-3xl font-black text-white font-sans tracking-tight mb-2 uppercase">
            Admin Login
          </h1>
          <p className="text-[#8C93B0] text-sm text-center font-sans font-medium">
            Enter credentials to access the PTSC dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 rounded-2xl border border-white/10 bg-[#121528] shadow-xl">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold font-mono uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-[#8C93B0] uppercase tracking-widest ml-0.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C93B0]">
                <FiMail className="size-4" />
              </div>
              <input
                type="email"
                placeholder="admin@ptsc.knit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF355E] transition-colors font-sans"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between ml-0.5">
              <label className="text-xs font-black text-[#8C93B0] uppercase tracking-widest">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-[#FF355E] hover:underline transition-all">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C93B0]">
                <FiLock className="size-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF355E] transition-colors font-sans"
                required
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="sleek"
            size="lg"
            className="w-full mt-2 justify-center shadow-lg gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <FiArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#8C93B0] font-sans font-semibold tracking-wider uppercase">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
