"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiMail, FiLock, FiArrowRight, FiArrowLeft, FiLoader } from "react-icons/fi";
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

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/profile";
      }
    } catch (err: any) {
      setServerError(err.message || "Log in failed");
    }
  };

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white pt-16 pb-16 flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF355E]/30 font-sans">
      {/* Vertical Dashed Guidelines Overlay matching /people */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 font-sans">
        
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            User Log In
          </h1>
          <p className="mt-2 text-sm text-[#8C93B0] font-sans">
            Log in to manage your profile and event registrations.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl font-sans">
          {serverError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF4D70] text-xs font-sans font-bold text-center">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 font-sans">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FiMail className="size-4 absolute left-3.5 top-3.5 text-[#8C93B0] pointer-events-none z-10" />
                        <Input
                          type="email"
                          placeholder="name@knit.ac.in"
                          className="pl-10"
                          disabled={loading}
                          {...field}
                        />
                      </div>
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
                      <div className="relative">
                        <FiLock className="size-4 absolute left-3.5 top-3.5 text-[#8C93B0] pointer-events-none z-10" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          disabled={loading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="sleek"
                size="lg"
                className="w-full mt-2 justify-center shadow-lg gap-2 font-sans"
                disabled={loading}
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
              </Button>
            </form>
          </Form>

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
