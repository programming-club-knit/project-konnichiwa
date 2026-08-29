"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiArrowLeft, FiCheck, FiAlertCircle, FiLoader, FiUserCheck, FiZap, FiBookOpen } from "react-icons/fi";
import { parseAcademicFromEmail, computeAcademicFromRoll } from "@/lib/academic";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");

  const [allowSignup, setAllowSignup] = useState<boolean>(true);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Derive academic info from email (e.g. abhay.24305@knit.ac.in) or manual roll number entry
  const parsedAcademic = useMemo(() => {
    const fromEmail = parseAcademicFromEmail(email);
    if (fromEmail.valid) return fromEmail;
    
    if (rollNo && /^\d{5,6}$/.test(rollNo.trim())) {
      const fromRoll = computeAcademicFromRoll(rollNo);
      if (fromRoll.valid) {
        const batchYear = rollNo.trim().length === 6 ? fromRoll.admissionYear + 3 : fromRoll.admissionYear + 4;
        return { ...fromRoll, rollNumber: rollNo.trim(), batchYear };
      }
    }
    return { valid: false as const, reason: "No valid roll/email" };
  }, [email, rollNo]);

  // Auto-sync rollNo & batch when email or roll is entered
  useEffect(() => {
    if (parsedAcademic.valid) {
      if (parsedAcademic.rollNumber && !rollNo) {
        setRollNo(parsedAcademic.rollNumber);
      }
      if (parsedAcademic.batchYear) {
        setBatch(String(parsedAcademic.batchYear));
      }
    }
  }, [parsedAcademic]);

  const hasFetchedSettingsRef = useRef(false);

  useEffect(() => {
    if (hasFetchedSettingsRef.current) return;
    hasFetchedSettingsRef.current = true;

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
          rollNo,
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
    <div className="min-h-screen w-full bg-[#090B14] text-white pt-12 pb-16 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl px-6">
        
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

        {fetchingSettings ? (
          <div className="p-16 text-center border border-white/10 rounded-lg bg-[#121626] flex items-center justify-center gap-3 text-xs text-slate-400 font-sans">
            <FiLoader className="size-5 animate-spin text-white/60" /> Checking portal status...
          </div>
        ) : !allowSignup ? (
          <div className="p-8 rounded-lg border border-red-500/20 bg-red-500/10 text-center space-y-4 font-sans max-w-md mx-auto">
            <FiAlertCircle className="size-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-red-300 tracking-tight">Registrations Closed</h2>
            <p className="text-xs text-red-300/80 leading-relaxed font-sans">
              Student registrations are currently disabled by administrator. Please check back later.
            </p>
            <div className="pt-2">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-sans text-white underline hover:text-slate-200">
                Already have an account? Log In <FiArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Main Card: Landscape on Desktop (lg:flex-row), Portrait on Mobile (flex-col) */
          <div className="rounded-lg border border-white/10 bg-[#121626] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch font-sans">
            
            {/* Left Column: Info & Branding */}
            <div className="flex-1 flex flex-col justify-between space-y-5 lg:border-r lg:border-white/10 lg:pr-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                  <FiZap className="size-3" /> Student Portal
                </div>
                
                <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
                  Student Registration
                </h1>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  Join PTSC KNIT with your official <strong className="text-white">@knit.ac.in</strong> email address. Your roll number, branch, and batch are managed automatically!
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <div className="grid size-6 place-items-center rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <FiCheck className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Instant Account Activation</strong>
                      <span className="text-slate-400">KNIT students log in directly with no waiting period.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <div className="grid size-6 place-items-center rounded bg-white/5 border border-white/10 text-slate-300 shrink-0 mt-0.5">
                      <FiBookOpen className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Automatic Academic Detection</strong>
                      <span className="text-slate-400">Roll No, Branch & Batch year are parsed from roll number or email.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate-300">
                    <div className="grid size-6 place-items-center rounded bg-white/5 border border-white/10 text-slate-300 shrink-0 mt-0.5">
                      <FiUserCheck className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-semibold">Personalized Profile</strong>
                      <span className="text-slate-400">Manage profile photo, view announcements and event history.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-1 text-xs">
                <p className="text-slate-400">
                  Already registered?{" "}
                  <Link href="/login" className="text-white font-semibold hover:underline">
                    Log In
                  </Link>
                </p>
                <p className="text-slate-400">
                  PTSC Executive Member?{" "}
                  <Link href="/admin/register" className="text-slate-300 font-medium hover:underline">
                    Executive Registration
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-2">
                  <FiCheck className="size-3.5" /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. rahul_knit"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    KNIT Email (@knit.ac.in) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. abhay.24305@knit.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                  {parsedAcademic.valid && (
                    <p className="mt-1 text-xs text-emerald-400 font-sans flex items-center gap-1 font-medium">
                      <FiCheck className="size-3 shrink-0" />
                      Auto-detected: <strong>{parsedAcademic.branch}</strong> • Batch {parsedAcademic.batchYear} (Year {parsedAcademic.year})
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 24305"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Batch Year
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2028"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-2.5 rounded-md bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <FiLoader className="size-3.5 animate-spin" /> Registering...
                    </>
                  ) : (
                    <>
                      Complete Registration <FiArrowRight className="size-3.5" />
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
