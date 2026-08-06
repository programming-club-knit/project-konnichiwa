"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheck, FiAlertCircle, FiLoader, FiShield, FiUserCheck, FiZap } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");

  const [allowSignup, setAllowSignup] = useState<boolean>(true);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.allowSignup !== undefined) {
          setAllowSignup(Boolean(data.allowSignup));
        }
      })
      .catch(() => setAllowSignup(true))
      .finally(() => setFetchingSettings(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!allowSignup) {
      setError("Registrations are currently closed by administrator.");
      return;
    }

    if (!email.toLowerCase().endsWith("@knit.ac.in")) {
      setError("General student registration requires an official @knit.ac.in email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          mobile: Number(mobile),
          password,
          batch: batch ? Number(batch) : undefined,
          registrationType: "general",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0D19] text-white pt-24 pb-16 flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF355E]/30 font-sans">
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl px-6">
        {fetchingSettings ? (
          <div className="p-16 text-center border border-white/10 rounded-3xl bg-[#121528] flex items-center justify-center gap-3 text-sm text-white/50 font-sans">
            <FiLoader className="size-6 animate-spin text-[#FF355E]" /> Checking portal status...
          </div>
        ) : !allowSignup ? (
          <div className="p-10 rounded-3xl border border-red-500/20 bg-red-500/10 text-center space-y-4 font-sans max-w-xl mx-auto">
            <FiAlertCircle className="size-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-red-300 uppercase tracking-wider font-sans">Registrations Closed</h2>
            <p className="text-xs text-red-300/80 leading-relaxed font-sans">
              Student registrations are currently disabled by administrator. Please check back later.
            </p>
            <div className="pt-4">
              <Link href="/login" className="inline-flex items-center gap-2 text-xs font-sans text-white underline hover:text-[#FF355E]">
                Already have an account? Log In <FiArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Main Card: Landscape on Desktop (lg:flex-row), Portrait on Mobile (flex-col) */
          <div className="rounded-3xl border border-white/10 bg-[#121528] p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch font-sans">
            
            {/* Left Column: Info & Branding */}
            <div className="flex-1 flex flex-col justify-between space-y-6 lg:border-r lg:border-white/10 lg:pr-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF355E]/10 border border-[#FF355E]/20 text-[#FF355E] text-xs font-bold uppercase tracking-wider">
                  <span className="size-2 rounded-full bg-[#FF355E] animate-pulse" />
                  Student Portal
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans leading-tight">
                  Student Registration
                </h1>
                
                <p className="text-sm text-[#8C93B0] leading-relaxed">
                  Join PTSC KNIT with your official <strong className="text-white">@knit.ac.in</strong> email address for instant access.
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <div className="grid size-6 place-items-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <FiCheck className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Instant Account Activation</strong>
                      <span>KNIT students log in directly with no waiting period.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <div className="grid size-6 place-items-center rounded-lg bg-[#FF355E]/10 border border-[#FF355E]/20 text-[#FF355E] shrink-0 mt-0.5">
                      <FiZap className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Event & Contest Access</strong>
                      <span>Register for hackathons, bootcamps, and track contest rankings.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <div className="grid size-6 place-items-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                      <FiUserCheck className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Personalized Profile</strong>
                      <span>Manage your student details and track club participation.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <p className="text-xs text-[#8C93B0]">
                  Already registered?{" "}
                  <Link href="/login" className="text-[#FF355E] font-bold hover:underline">
                    Log In
                  </Link>
                </p>
                <p className="text-xs text-[#8C93B0]">
                  PTSC Executive Member?{" "}
                  <Link href="/admin/register" className="text-white/80 font-bold hover:underline">
                    Executive Registration
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="flex-1 flex flex-col justify-center space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <FiCheck className="size-4" /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="rahul_knit"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      KNIT Email (@knit.ac.in)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@knit.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      Batch Year
                    </label>
                    <input
                      type="number"
                      placeholder="2026"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3.5 rounded-xl bg-[#FF355E] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:bg-[#FF4D70] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FiLoader className="size-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    <>
                      Complete Registration <FiArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
