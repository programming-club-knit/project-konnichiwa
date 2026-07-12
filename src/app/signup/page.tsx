"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiUsers,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";
import { cn } from "@/lib/utils";

const POST_OPTIONS = [
  { label: "General Member (No specific core post)", value: "" },
  { label: "Executive members", value: "Executive members" },
  { label: "Class Mentor", value: "Class Mentor" },
  { label: "Event Head", value: "Event Head" },
  { label: "Competitive Programming Head", value: "Competitive Programming Head" },
  { label: "Web Development Head", value: "Web Development Head" },
  { label: "Data Science Head", value: "Data Science Head" },
  { label: "GenAI Head", value: "GenAI Head" },
  { label: "App Dev Head", value: "App Dev Head" },
  { label: "Media and Design Head", value: "Media and Design Head" },
  { label: "Joint Secretary", value: "Joint Secretary" },
];

const PERKS = [
  {
    icon: FiCode,
    title: "Real-world tech skills",
    desc: "From full-stack web dev to system design and competitive programming.",
  },
  {
    icon: FiCpu,
    title: "Hackathons & OSS",
    desc: "Build open-source software and participate in national level hackathons.",
  },
  {
    icon: FiUsers,
    title: "500+ Active members",
    desc: "Connect, collaborate, and learn from seniors, batchmates & alumni.",
  },
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobile: "",
    batch: "",
    post: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (formData.username.trim().length < 6) {
      setError("Username must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        mobile: Number(formData.mobile.replace(/\D/g, "")),
        password: formData.password,
      };

      if (formData.batch) {
        payload.batch = Number(formData.batch);
      }
      if (formData.post) {
        payload.post = formData.post;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccessMsg(
        data.message ||
          "Registered successfully. An admin needs to approve your account before you can log in."
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong during registration. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthCard
      layout="landscape"
      title="Create an account"
      subtitle="Join the programming & tech community at KNIT Sultanpur"
      footerText={!successMsg ? "Already have an account?" : undefined}
      footerLinkText={!successMsg ? "Log in" : undefined}
      footerLinkHref={!successMsg ? "/login" : undefined}
      asideContent={
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
            <span className="inline-block rounded-md bg-brand/20 px-2.5 py-1 text-xs font-mono font-medium text-brand-2">
              PTSC MEMBERSHIP
            </span>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Open to all students at KNIT Sultanpur across every discipline and year. Bring your passion and curiosity.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex items-start gap-3">
                <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-brand-2">
                  <perk.icon className="size-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      {successMsg ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <FiCheckCircle className="size-7" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground">
            Registration Complete
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {successMsg}
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex h-10 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-brand font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand/90"
            >
              Go to Sign in <FiArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
              <FiAlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="e.g. Alex"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="e.g. Kumar"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. alex@knit.ac.in"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="min 6 chars"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="10 digit number"
                value={formData.mobile}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="batch">Graduation Year (Batch)</Label>
              <Input
                id="batch"
                name="batch"
                type="number"
                min={2000}
                max={2100}
                placeholder="e.g. 2026"
                value={formData.batch}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="post">Role / Post</Label>
              <select
                id="post"
                name="post"
                value={formData.post}
                onChange={handleChange}
                disabled={loading}
                className={cn(
                  "flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground transition-all duration-200 outline-none focus-visible:border-brand/60 focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {POST_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-zinc-900 text-foreground"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 h-10 w-full bg-brand font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand/90 active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Sign up <FiArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
