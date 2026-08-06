"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiArrowRight, FiLoader } from "react-icons/fi";

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
    <div className="min-h-screen w-full bg-[#0B0D19] text-white pt-24 pb-16 flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF355E]/30 font-sans">
      <div className="relative z-10 w-full max-w-md px-6 font-sans">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            User Log In
          </h1>
          <p className="mt-2 text-sm text-[#8C93B0] font-sans">
            Log in to manage your profile and event registrations.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#121528] p-8 shadow-2xl font-sans">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <label className="text-[11px] font-sans font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="size-4 absolute left-3.5 top-3.5 text-[#8C93B0]" />
                <input
                  type="email"
                  required
                  placeholder="name@knit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-sans focus:outline-none focus:border-[#FF355E]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-sans font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="size-4 absolute left-3.5 top-3.5 text-[#8C93B0]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white font-sans focus:outline-none focus:border-[#FF355E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#FF355E] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:bg-[#FF4D70] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiLoader className="size-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Log In <FiArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2 font-sans">
            <p className="text-xs text-[#8C93B0]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#FF355E] font-bold hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-xs text-[#8C93B0]">
              PTSC Admin?{" "}
              <Link href="/admin" className="text-white/80 font-bold hover:underline">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
