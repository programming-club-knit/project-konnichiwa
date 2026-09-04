"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowRight, FiArrowLeft, FiCheck, FiAlertCircle, FiLoader, FiShield, FiAward, FiBookOpen } from "react-icons/fi";
import { parseAcademicFromEmail, computeAcademicFromRoll } from "@/lib/academic";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const POSTS = [
  "Secretary",
  "Joint Secretary",
  "Web Development Head",
  "Competitive Programming Head",
  "Cyber Security Head",
  "Data Science Head",
  "GenAI Head",
  "App Dev Head",
  "Media and Design Head",
  "Class Mentor",
  "Event Head",
  "Executive members",
];

const adminRegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  rollNo: z.string().optional(),
  batch: z.string().optional(),
  post: z.string().min(1, "Please select your PTSC Executive post"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();

  const [allowSignup, setAllowSignup] = useState<boolean>(true);
  const [fetchingSettings, setFetchingSettings] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      mobile: "",
      rollNo: "",
      batch: "",
      post: "",
      password: "",
    },
  });

  const watchedEmail = form.watch("email");
  const watchedRollNo = form.watch("rollNo");

  // Derive academic details from email or manual roll number entry
  const parsedAcademic = useMemo(() => {
    const fromEmail = parseAcademicFromEmail(watchedEmail || "");
    if (fromEmail.valid) return fromEmail;
    
    if (watchedRollNo && /^\d{5,6}$/.test(watchedRollNo.trim())) {
      const fromRoll = computeAcademicFromRoll(watchedRollNo);
      if (fromRoll.valid) {
        const batchYear = watchedRollNo.trim().length === 6 ? fromRoll.admissionYear + 3 : fromRoll.admissionYear + 4;
        return { ...fromRoll, rollNumber: watchedRollNo.trim(), batchYear };
      }
    }
    return { valid: false as const, reason: "No valid roll/email" };
  }, [watchedEmail, watchedRollNo]);

  useEffect(() => {
    if (parsedAcademic.valid) {
      if (parsedAcademic.rollNumber && !form.getValues("rollNo")) {
        form.setValue("rollNo", parsedAcademic.rollNumber, { shouldValidate: true });
      }
      if (parsedAcademic.batchYear) {
        form.setValue("batch", String(parsedAcademic.batchYear), { shouldValidate: true });
      }
    }
  }, [parsedAcademic, form]);

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

  const onSubmit = async (values: AdminRegisterFormValues) => {
    setServerError(null);
    setSuccess(null);

    if (!allowSignup) {
      setServerError("Executive registrations are currently closed by administrator.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          mobile: Number(values.mobile),
          rollNo: values.rollNo,
          password: values.password,
          batch: values.batch ? Number(values.batch) : undefined,
          post: values.post,
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
      setServerError(err.message || "Registration failed. Please try again.");
    }
  };

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white pt-12 pb-16 flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF355E]/30 font-sans">
      {/* Vertical Dashed Guidelines Overlay matching /people */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

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
          <div className="p-16 text-center border border-white/10 rounded-3xl bg-[#141414] flex items-center justify-center gap-3 text-sm text-white/50 font-sans">
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
          <div className="rounded-3xl border border-white/10 bg-[#141414] p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch font-sans">
            
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
              {serverError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF4D70] text-xs font-bold text-center">
                  {serverError}
                </div>
              )}

              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <FiCheck className="size-4" /> {success}
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ankit" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Singh" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="ankit_ptsc" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="9876543210" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="executive.23201@knit.ac.in"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        {parsedAcademic.valid && (
                          <p className="mt-1.5 text-[11px] text-emerald-400 font-sans flex items-center gap-1 font-medium">
                            <FiCheck className="size-3.5 shrink-0" />
                            Auto-detected: <strong>{parsedAcademic.branch}</strong> • Batch {parsedAcademic.batchYear} (Year {parsedAcademic.year})
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rollNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number</FormLabel>
                          <FormControl>
                            <Input placeholder="23201" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Year</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2027" disabled={loading} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="post"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PTSC Executive Post</FormLabel>
                        <FormControl>
                          <select
                            disabled={loading}
                            className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 font-sans [color-scheme:dark]"
                            {...field}
                          >
                            <option value="">Select Post...</option>
                            {POSTS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="sleek"
                    size="lg"
                    className="w-full mt-4 justify-center shadow-lg gap-2 font-sans"
                    disabled={loading}
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
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
