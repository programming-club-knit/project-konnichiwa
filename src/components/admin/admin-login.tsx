"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiLock, FiMail, FiArrowRight, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setServerError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      // On success, redirect to the admin dashboard with fresh page load
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred");
    }
  };

  const loading = form.formState.isSubmitting;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0f0f0f] font-sans">
      {/* Vertical Dashed Guidelines Overlay to match UI layout style */}
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

        <div className="flex flex-col items-center mb-8">
          <div className="grid size-16 place-items-center rounded-2xl border border-white/10 bg-[#141414] shadow-xl mb-6">
            <Image
              src="/logo.png"
              alt="PTSC logo"
              width={40}
              height={40}
              className="size-10 object-contain"
            />
          </div>
          <h1 className="text-3xl font-black text-white font-sans tracking-tight mb-2 uppercase">
            Admin Login
          </h1>
          <p className="text-[#8C93B0] text-sm text-center font-sans font-medium">
            Enter credentials to access the PTSC dashboard.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-white/10 bg-[#141414] shadow-xl font-sans">
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF4D70] text-xs font-semibold font-sans uppercase tracking-wider text-center">
              {serverError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 font-sans">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C93B0]">
                          <FiMail className="size-4" />
                        </div>
                        <Input
                          type="email"
                          placeholder="admin@ptsc.knit.ac.in"
                          className="pl-11"
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a href="#" className="text-xs font-bold text-[#FF355E] hover:underline transition-all font-sans">
                        Forgot?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C93B0]">
                          <FiLock className="size-4" />
                        </div>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-11"
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
                    <FiLoader className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <FiArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-2 font-sans">
            <p className="text-xs text-[#8C93B0] font-sans">
              PTSC Executive Member?{" "}
              <Link href="/admin/register" className="text-[#FF355E] font-bold hover:underline font-sans">
                Register Here
              </Link>
            </p>
            <p className="text-[11px] text-white/30 uppercase tracking-widest font-sans">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
