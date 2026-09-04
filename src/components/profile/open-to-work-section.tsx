"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiBriefcase, FiCheck, FiLoader, FiGlobe, FiGithub, FiLinkedin, FiFileText } from "react-icons/fi";
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

export type OpenToWorkSectionProps = {
  user: any;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
};

const openToWorkSchema = z.object({
  showInHireUs: z.boolean(),
  availability: z.string().min(1, "Please select availability"),
  headlineRole: z.string().optional(),
  domain: z.string().optional(),
  skillsInput: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  resume: z.string().optional(),
}).refine(
  (data) => !data.showInHireUs || (Boolean(data.headlineRole && data.headlineRole.trim().length > 0)),
  {
    message: "Target Job Role / Headline is required when showing in Hire Us showcase",
    path: ["headlineRole"],
  }
);

type OpenToWorkFormValues = z.infer<typeof openToWorkSchema>;

export function OpenToWorkSection({ user, onSuccess, onError }: OpenToWorkSectionProps) {
  const form = useForm<OpenToWorkFormValues>({
    resolver: zodResolver(openToWorkSchema),
    defaultValues: {
      showInHireUs: Boolean(user.showInHireUs),
      availability: user.availability || "Full-time",
      headlineRole: user.headlineRole || "",
      domain: user.domain || "",
      skillsInput: Array.isArray(user.skills) ? user.skills.join(", ") : "",
      github: user.github || "",
      linkedin: user.linkedin || "",
      portfolio: user.portfolio || "",
      resume: user.resume || "",
    },
  });

  const onSubmit = async (values: OpenToWorkFormValues) => {
    try {
      const res = await fetch("/api/user/profile/talent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showInHireUs: values.showInHireUs,
          availability: values.availability,
          headlineRole: values.headlineRole,
          domain: values.domain,
          skills: values.skillsInput,
          github: values.github,
          linkedin: values.linkedin,
          portfolio: values.portfolio,
          resume: values.resume,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update Open to Work profile");

      onSuccess("Open to Work / Hire Us settings saved successfully!");
    } catch (err: any) {
      onError(err.message || "Failed to save talent settings");
    }
  };

  const saving = form.formState.isSubmitting;
  const showInHireUs = form.watch("showInHireUs");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-sans">
        {/* Top Banner Box */}
        <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-[#F47174]/10 border border-[#F47174]/20 text-[#F47174] grid place-items-center shrink-0">
              <FiBriefcase className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                #OpenToWork • Hire Us Showcase
              </h3>
              <p className="text-xs text-[#8C93B0] mt-0.5">
                Feature your talent, skills, and links on the public <strong className="text-white">/hire-us</strong> recruitment page for recruiters and tech companies.
              </p>
            </div>
          </div>

          <Link
            href="/hire-us"
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
          >
            View Talent Page
          </Link>
        </div>

        {/* Directory Showcase Opt-in Toggle */}
        <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-white block">
              Show Profile in Hire Us Showcase?
            </span>
            <span className="text-xs text-[#8C93B0]">
              When enabled, your profile card with skills and resume link will appear on <strong className="text-white">/hire-us</strong>.
            </span>
          </div>

          <FormField
            control={form.control}
            name="showInHireUs"
            render={({ field }) => (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F47174]"></div>
              </label>
            )}
          />
        </div>

        {/* Role & Availability Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="headlineRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Target Job Role / Headline {showInHireUs && "*"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Frontend Engineer / Full Stack Developer"
                    disabled={saving}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Availability Type</FormLabel>
                <FormControl>
                  <select
                    disabled={saving}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-sm text-white transition-all outline-none focus:border-[#FF355E] focus:ring-1 focus:ring-[#FF355E]/50 font-sans [color-scheme:dark]"
                    {...field}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Domain</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Web Development / Machine Learning"
                    disabled={saving}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skillsInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Top Skills (comma separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. React, Next.js, Node.js, TypeScript"
                    disabled={saving}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Portfolio & Social Links */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Links & Resume
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FiFileText className="size-3.5 text-[#F47174]" /> Resume URL / Drive Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://drive.google.com/..."
                      disabled={saving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FiGlobe className="size-3.5 text-[#F47174]" /> Personal Portfolio Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourname.dev"
                      disabled={saving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FiGithub className="size-3.5 text-[#F47174]" /> GitHub Profile
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/..."
                      disabled={saving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <FiLinkedin className="size-3.5 text-[#F47174]" /> LinkedIn Profile
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      disabled={saving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button
            type="submit"
            variant="sleek"
            size="default"
            disabled={saving}
            className="gap-2"
          >
            {saving ? (
              <>
                <FiLoader className="size-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FiCheck className="size-4" /> Save Open To Work Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
