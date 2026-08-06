"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBriefcase, FiCheck, FiLoader, FiGlobe, FiGithub, FiLinkedin, FiFileText, FiCode } from "react-icons/fi";

export type OpenToWorkSectionProps = {
  user: any;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
};

export function OpenToWorkSection({ user, onSuccess, onError }: OpenToWorkSectionProps) {
  const [showInHireUs, setShowInHireUs] = useState<boolean>(Boolean(user.showInHireUs));
  const [availability, setAvailability] = useState<string>(user.availability || "Full-time");
  const [headlineRole, setHeadlineRole] = useState<string>(user.headlineRole || "");
  const [domain, setDomain] = useState<string>(user.domain || "");
  const [skillsInput, setSkillsInput] = useState<string>(
    Array.isArray(user.skills) ? user.skills.join(", ") : ""
  );
  const [github, setGithub] = useState<string>(user.github || "");
  const [linkedin, setLinkedin] = useState<string>(user.linkedin || "");
  const [portfolio, setPortfolio] = useState<string>(user.portfolio || "");
  const [resume, setResume] = useState<string>(user.resume || "");

  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile/talent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showInHireUs,
          availability,
          headlineRole,
          domain,
          skills: skillsInput,
          github,
          linkedin,
          portfolio,
          resume,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update Open to Work profile");

      onSuccess("Open to Work / Hire Us settings saved successfully!");
    } catch (err: any) {
      onError(err.message || "Failed to save talent settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans">
      {/* Top Banner Box */}
      <div className="p-5 rounded-2xl bg-[#0B0D19] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-[#FF355E]/10 border border-[#FF355E]/20 text-[#FF355E] grid place-items-center shrink-0">
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
      <div className="p-4 rounded-2xl bg-[#0B0D19] border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-white block">
            Show Profile in Hire Us Showcase?
          </span>
          <span className="text-xs text-[#8C93B0]">
            When enabled, your profile card with skills and resume link will appear on <strong className="text-white">/hire-us</strong>.
          </span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showInHireUs}
            onChange={(e) => setShowInHireUs(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF355E]"></div>
        </label>
      </div>

      {/* Role & Availability Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1">
            Target Job Role / Headline
          </label>
          <input
            type="text"
            required={showInHireUs}
            placeholder="e.g. Frontend Engineer / Full Stack Developer"
            value={headlineRole}
            onChange={(e) => setHeadlineRole(e.target.value)}
            className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1">
            Job Availability Type
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
          >
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Freelance">Freelance</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1">
            Technical Domain
          </label>
          <input
            type="text"
            placeholder="e.g. Web Development / Machine Learning"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1">
            Top Skills (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. React, Next.js, Node.js, TypeScript"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
          />
        </div>
      </div>

      {/* Portfolio & Social Links */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Links & Resume
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1 flex items-center gap-1.5">
              <FiFileText className="size-3.5 text-[#FF355E]" /> Resume URL / Drive Link
            </label>
            <input
              type="text"
              placeholder="https://drive.google.com/..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1 flex items-center gap-1.5">
              <FiGlobe className="size-3.5 text-[#FF355E]" /> Personal Portfolio Website
            </label>
            <input
              type="text"
              placeholder="https://yourname.dev"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1 flex items-center gap-1.5">
              <FiGithub className="size-3.5 text-[#FF355E]" /> GitHub Profile
            </label>
            <input
              type="text"
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#8C93B0] uppercase block mb-1 flex items-center gap-1.5">
              <FiLinkedin className="size-3.5 text-[#FF355E]" /> LinkedIn Profile
            </label>
            <input
              type="text"
              placeholder="https://linkedin.com/in/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full bg-[#0B0D19] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-[#FF355E]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-[#FF355E] hover:bg-[#FF4D70] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <FiLoader className="size-4 animate-spin" /> : <><FiCheck className="size-4" /> Save Open To Work Profile</>}
        </button>
      </div>
    </form>
  );
}
