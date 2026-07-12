"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiAlertCircle, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = (params?.token as string) || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid or expired reset token");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Something went wrong updating your password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create new password"
      subtitle="Enter a strong new password for your account"
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
              Password Updated
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-brand font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand/90"
          >
            Sign in now <FiArrowRight className="size-4" />
          </Link>
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
            <Label htmlFor="password">New Password</Label>
            <PasswordInput
              id="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-type your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="mt-2 h-10 w-full bg-brand font-medium text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand/90 active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating password...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Update password <FiArrowRight className="size-4" />
              </span>
            )}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
