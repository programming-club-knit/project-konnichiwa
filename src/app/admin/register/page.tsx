"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiArrowLeft, FiCheck, FiAlertCircle, FiLoader, FiShield, FiUserCheck, FiAward, FiBookOpen } from "react-icons/fi";
import { parseAcademicFromEmail, computeAcademicFromRoll } from "@/lib/academic";

const POSTS = [
  "Joint Secretary",
  "Competitive Programming Head",
  "Web Development Head",
  "Data Science Head",
  "GenAI Head",
  "App Dev Head",
  "Media and Design Head",
  "Class Mentor",
  "Event Head",
  "Executive members",
];

export default function AdminRegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");
  const [post, setPost] = useState("");

  const [allowSignup, setAllowSignup] = useState<boolean>(true);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Derive academic details from email or manual roll number entry
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
      setError("Executive registrations are currently closed by administrator.");
      return;
    }

    if (!post) {
      setError("Please select your PTSC Executive post.");
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
          post,
          registrationType: "executive",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(data.message);
      setTimeout(() => {
        router.push("/admin");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0D19] text-white pt-12 pb-16 flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF355E]/30 font-sans">
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl px-6">
        
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[#8C93B0] hover:text-white hover:border-[#FF355E]/50 hover:bg-[#FF355E]/10 text-xs font-bold uppercase tracking-wider transition-all shadow-md group"
          >
            <FiArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform text-[#FF355E]" />
            Back to Home
          </Link>
        </div>

        {fetchingSettings ? (
          <div className="p-16 text-center border border-white/10 rounded-3xl bg-[#121528] flex items-center justify-center gap-3 text-sm text-white/50 font-sans">
            <FiLoader className="size-6 animate-spin text-[#FF355E]" /> Checking portal status...
          </div>
        ) : !allowSignup ? (
          <div className="p-10 rounded-3xl border border-red-500/20 bg-red-500/10 text-center space-y-4 font-sans max-w-xl mx-auto">
            <FiAlertCircle className="size-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-red-300 uppercase tracking-wider">Registrations Closed</h2>
            <p className="text-xs text-red-300/80 leading-relaxed font-sans">
              Executive member signups are currently disabled by administrator.
            </p>
            <div className="pt-4">
              <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-sans text-white underline hover:text-[#FF355E]">
                Go to Admin Login <FiArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Main Card: Landscape on Desktop (lg:flex-row), Portrait on Mobile (flex-col) */
          <div className="rounded-3xl border border-white/10 bg-[#121528] p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch font-sans">
            
            {/* Left Column: Executive Info & Branding */}
            <div className="flex-1 flex flex-col justify-between space-y-6 lg:border-r lg:border-white/10 lg:pr-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF355E]/10 border border-[#FF355E]/20 text-[#FF355E] text-xs font-bold uppercase tracking-wider">
                  <FiShield className="size-3.5" /> Executive Portal
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans leading-tight">
                  Executive Registration
                </h1>
                
                <p className="text-sm text-[#8C93B0] leading-relaxed">
                  Register as a PTSC Executive Member. Your roll number, branch, and batch year are managed automatically from your email or roll number.
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <div className="grid size-6 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <FiAlertCircle className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Admin Verification Required</strong>
                      <span>Executive applications are reviewed by PTSC admins before granting dashboard access.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <div className="grid size-6 place-items-center rounded-lg bg-[#FF355E]/10 border border-[#FF355E]/20 text-[#FF355E] shrink-0 mt-0.5">
                      <FiAward className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Executive Position Assignment</strong>
                      <span>Select your official PTSC domain head or mentor post during registration.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <div className="grid size-6 place-items-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                      <FiBookOpen className="size-3.5" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Automatic Academic Detection</strong>
                      <span>Branch & Batch year are parsed from roll number or email.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <p className="text-xs text-[#8C93B0]">
                  Already have an admin account?{" "}
                  <Link href="/admin" className="text-[#FF355E] font-bold hover:underline">
                    Admin Login
                  </Link>
                </p>
                <p className="text-xs text-[#8C93B0]">
                  General KNIT Student?{" "}
                  <Link href="/register" className="text-white/80 font-bold hover:underline">
                    Student Registration
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column: Executive Form Inputs */}
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
                      placeholder="Ankit"
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
                      placeholder="Singh"
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
                      placeholder="ankit_ptsc"
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

                <div>
                  <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="executive.23201@knit.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                  />
                  {parsedAcademic.valid && (
                    <p className="mt-1.5 text-[11px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
                      <FiCheck className="size-3.5 shrink-0" />
                      Auto-detected: <strong>{parsedAcademic.branch}</strong> • Batch {parsedAcademic.batchYear} (Year {parsedAcademic.year})
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      placeholder="23201"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                      Batch Year
                    </label>
                    <input
                      type="number"
                      placeholder="2027"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1.5">
                    PTSC Executive Post
                  </label>
                  <select
                    required
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                    className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                  >
                    <option value="">Select Post...</option>
                    {POSTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
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
                      <FiLoader className="size-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      Submit Executive Application <FiArrowRight className="size-4" />
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
