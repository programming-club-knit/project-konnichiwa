"use client";

import { useState } from "react";
import Link from "next/link";
import { FiAlertCircle, FiArrowRight, FiCheckCircle, FiTerminal } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setResetToken(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Could not generate reset token. Check your email address.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your email to receive password reset instructions"
      backHref="/login"
      backText="Back to sign in"
    >
      {success ? (
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <FiCheckCircle className="size-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Check your email
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              If an account with <strong className="text-foreground font-medium">{email}</strong> exists, we have generated your password reset token.
            </p>
          </div>

          {resetToken && (
            <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 text-left">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-2">
                <FiTerminal className="size-3.5" />
                <span>DEV MODE / DIRECT TOKEN ACCESS</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Email delivery is running in local mode. Click below to proceed directly with your token:
              </p>
              <Link
                href={`/reset-password/${resetToken}`}
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-brand/20 text-xs font-medium text-brand-2 transition-colors hover:bg-brand/30"
              >
                Reset password now <FiArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          <Button
            onClick={() => {
              setSuccess(false);
              setEmail("");
            }}
            variant="outline"
            className="h-9 w-full border-white/10"
          >
            Try another email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
              <FiAlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. alex@knit.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !email}
            className="mt-2 h-10 w-full bg-brand font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand/90 active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending link...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Send reset instructions <FiArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
