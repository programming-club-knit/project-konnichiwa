"use client";

import { useState } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiBriefcase, FiZap } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";

export type PeopleMember = {
  id: string;
  name: string;
  batch: string;
  company: string;
  role: string;
  domain: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
};

export const PEOPLE_MEMBERS: PeopleMember[] = [
  {
    id: "aseem-srivastava",
    name: "Aseem Srivastava",
    batch: "Batch of '17",
    company: "MBZUAI",
    role: "Postdoctoral Researcher",
    domain: "AI & LLMs",
    imageSrc: "/peoples/aseem.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "prashant-tripathi",
    name: "Prashant Tripathi",
    batch: "Batch of '21",
    company: "Google",
    role: "Software Engineer",
    domain: "CP & Algorithms",
    imageSrc: "/peoples/prashant-tripathi.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "sudhi-awasthi",
    name: "Sudhi Awasthi",
    batch: "Batch of '21",
    company: "Bloomberg",
    role: "Senior Software Engineer",
    domain: "High-Performance Systems",
    imageSrc: "/peoples/sudhi-awasthi.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },

];

export const BATCH_FILTERS = [
  "ALL BATCHES",
  "Batch of '25",
  "Batch of '24",
  "Batch of '23",
  "Batch of '21",
  "Batch of '17",
];

export function PeopleSection() {
  const [selectedBatch, setSelectedBatch] = useState("ALL BATCHES");

  const filteredPeople =
    selectedBatch === "ALL BATCHES"
      ? PEOPLE_MEMBERS
      : PEOPLE_MEMBERS.filter((person) => person.batch === selectedBatch);

  return (
    <section id="people" className="relative bg-[#0B0D19] py-24 border-b border-white/5">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-tight">
            Cracked Minds of{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-[#FF355E]">PTSC</span>
            </Highlighter>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8C93B0] max-w-2xl mx-auto font-sans leading-relaxed">
            Spotlighting top cracked seniors, alumni, and high achievers driving engineering excellence across top tech companies worldwide.
          </p>
        </div>

        {/* Batch Year Filter Bar */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 border-b border-white/10">
            {BATCH_FILTERS.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`relative pb-4 -mb-[1px] text-xs font-black uppercase tracking-widest transition-colors duration-300 ${selectedBatch === batch
                    ? "text-white"
                    : "text-[#8C93B0] hover:text-white/80"
                  }`}
              >
                {batch}
                {selectedBatch === batch && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FF355E] shadow-[0_0_15px_rgba(255,53,94,0.6)] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cracked People Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => {
            const splitName = person.name.split(" ");
            const firstName = splitName[0];
            const lastName = splitName.slice(1).join(" ");

            return (
              <div
                key={person.id}
                className="relative overflow-hidden rounded-xl bg-[#0B0D19] border border-white/10 aspect-[3/4.5] flex flex-col justify-between"
              >
                {/* Background Image */}
                <Image
                  src={person.imageSrc}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />

                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D19] via-[#0B0D19]/40 to-transparent" />

                {/* Top Left Info: Alumni & Batch */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#FF355E] uppercase">
                    PTSC ALUMNI
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-white/80 uppercase font-sans">
                    {person.batch.toUpperCase()}
                  </span>
                </div>

                {/* Right vertical CRACKED watermark */}
                <div className="absolute top-0 right-2 bottom-0 z-0 flex items-center justify-center pointer-events-none">
                  <span
                    className="text-[90px] font-black text-white/5 uppercase leading-none tracking-tighter"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    CRACKED.
                  </span>
                </div>

                {/* Bottom Info Container */}
                <div className="relative z-10 p-6 mt-auto flex flex-col">
                  {/* Name split into two lines with pink underline */}
                  <div className="mb-3">
                    <h3 className="text-4xl font-black text-white uppercase leading-none tracking-tight">
                      {firstName}
                    </h3>
                    <h3 className="text-4xl font-black text-white uppercase leading-none tracking-tight inline-block border-b-4 border-[#FF355E] pb-1">
                      {lastName}
                    </h3>
                  </div>

                  {/* Role and Company */}
                  <p className="text-sm font-medium text-white/90">
                    {person.role}
                  </p>
                  <p className="text-sm font-black text-[#FFB800] uppercase tracking-wider mt-1">
                    {person.company}
                  </p>

                  {/* Footer Socials */}
                  <div className="mt-5 pt-4 flex items-center gap-5 border-t border-white/20">
                    {person.github && (
                      <a href={person.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-white group/social">
                        <FiGithub className="size-4 group-hover/social:text-[#FF355E] transition-colors" /> GitHub
                      </a>
                    )}
                    {person.linkedin && (
                      <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-semibold text-white/80 transition-colors hover:text-white group/social">
                        <FiLinkedin className="size-4 group-hover/social:text-[#FF355E] transition-colors" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
