"use client";

import Image from "next/image";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export type PeopleCardProps = {
  name: string;
  batch: string;
  company: string;
  role: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
  isPTSCAlumni?: boolean;
};

export function formatBatchYear(batchInput: string | number | undefined | null): string {
  if (!batchInput) return "Other";
  const str = String(batchInput).trim();
  if (!str) return "Other";
  if (str.startsWith("Batch of")) return str;
  if (str.toLowerCase() === "other") return "Other";

  const num = parseInt(str.replace(/\D/g, ""), 10);
  if (!isNaN(num) && num > 1900 && num < 2100) {
    const shortYear = String(num).slice(-2);
    return `Batch of '${shortYear}`;
  }
  return "Other";
}

export function PeopleCard({
  name,
  batch,
  company,
  role,
  imageSrc,
  github,
  linkedin,
  isPTSCAlumni = true,
}: PeopleCardProps) {
  const splitName = name ? name.trim().split(" ") : ["First", "Last"];
  const firstName = splitName[0] || "First";
  const lastName = splitName.slice(1).join(" ") || "Last";
  const formattedBatch = formatBatchYear(batch);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0B0D19] border border-white/10 aspect-[3/4.5] flex flex-col justify-between shadow-2xl">
      {/* Background Image */}
      <Image
        src={imageSrc || "/teams/default-avatar.png"}
        alt={name || "Alumni Member"}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
      />

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D19] via-[#0B0D19]/40 to-transparent" />

      {/* Top Left Info: Alumni & Batch */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
        <span className="text-[10px] font-extrabold tracking-widest text-[#FF355E] uppercase font-sans">
          {isPTSCAlumni !== false ? "PTSC ALUMNI" : "ALUMNI"}
        </span>
        <span className="text-xs font-semibold tracking-widest text-white/80 uppercase font-sans">
          {formattedBatch.toUpperCase()}
        </span>
      </div>

      {/* Right vertical CRACKED watermark */}
      <div className="absolute top-0 right-2 bottom-0 z-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[90px] font-black text-white/5 uppercase leading-none tracking-tighter"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          CRACKED.
        </span>
      </div>

      {/* Bottom Info Container */}
      <div className="relative z-10 p-6 mt-auto flex flex-col">
        {/* Name split into two lines with pink underline */}
        <div className="mb-3">
          <h3 className="text-4xl font-black text-white uppercase leading-none tracking-tight font-sans">
            {firstName}
          </h3>
          <h3 className="text-4xl font-black text-white uppercase leading-none tracking-tight inline-block border-b-4 border-[#FF355E] pb-1 font-sans">
            {lastName}
          </h3>
        </div>

        {/* Role and Company */}
        <p className="text-sm font-medium text-white/90 font-sans">
          {role || "Engineering Role"}
        </p>
        <p className="text-sm font-black text-[#FFB800] uppercase tracking-wider mt-1 font-sans">
          {company || "Tech Org"}
        </p>

        {/* Footer Socials */}
        <div className="mt-5 pt-4 flex items-center gap-5 border-t border-white/20">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-white group/social font-sans"
            >
              <FiGithub className="size-4 group-hover/social:text-[#FF355E] transition-colors" /> GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-white group/social font-sans"
            >
              <FiLinkedin className="size-4 group-hover/social:text-[#FF355E] transition-colors" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
