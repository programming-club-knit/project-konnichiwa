"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiArrowRight, FiArrowLeft, FiLoader } from "react-icons/fi";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Log in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090B14] text-white pt-16 pb-16 flex flex-col items-center justify-center relative overflow-hidden font-sans">
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

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Member Log In
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-sans">
            Log in to manage your profile and event registrations.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#121626] p-6 sm:p-7 font-sans">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="size-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@knit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 pl-10 pr-4 text-sm text-white font-sans placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="size-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 pl-10 pr-4 text-sm text-white font-sans placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="size-3.5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Log In <FiArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/10 text-center space-y-1.5 font-sans">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-white font-medium hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-xs text-slate-400">
              PTSC Admin?{" "}
              <Link href="/admin" className="text-white font-medium hover:underline">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
