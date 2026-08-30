"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLock, FiMail, FiArrowRight, FiArrowLeft, FiLoader } from 'react-icons/fi';

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
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-admin-panel="true" className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#090B14] font-sans">
      <div className="relative z-10 w-full max-w-md px-6 font-sans">
        
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold tracking-wide transition-all group"
          >
            <FiArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="grid size-14 place-items-center rounded-lg border border-white/10 bg-[#121626] mb-4">
            <Image
              src="/logo.png"
              alt="PTSC logo"
              width={36}
              height={36}
              className="size-9 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white font-sans tracking-tight mb-1">
            Admin Console Login
          </h1>
          <p className="text-slate-400 text-xs text-center font-sans">
            Enter credentials to access the PTSC administrative dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 sm:p-7 rounded-lg border border-white/10 bg-[#121626] font-sans">
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5 font-sans">
            <label className="text-xs font-semibold text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail className="size-4" />
              </div>
              <input
                type="email"
                placeholder="admin@ptsc.knit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors font-sans"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 font-sans">
            <div className="flex items-center justify-between font-sans">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="size-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 transition-colors font-sans"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="size-3.5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <FiArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-1.5 font-sans">
          <p className="text-xs text-slate-400 font-sans">
            PTSC Executive Member?{" "}
            <Link href="/admin/register" className="text-white font-medium hover:underline">
              Register Here
            </Link>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
