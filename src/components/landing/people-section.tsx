"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { PeopleCard } from "@/components/people/people-card";
import { Highlighter } from "@/components/ui/highlighter";

export type PeopleMember = {
  _id?: string;
  id?: string;
  name: string;
  batch: string;
  company: string;
  role: string;
  domain: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
  isPTSCAlumni?: boolean;
};

export const INITIAL_PEOPLE_MEMBERS: PeopleMember[] = [
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

export function formatBatchYear(batchInput: string | number | undefined): string {
  if (!batchInput) return "Batch of '25";
  const str = String(batchInput).trim();
  if (str.startsWith("Batch of")) return str;
  const num = parseInt(str.replace(/\D/g, ""), 10);
  if (!isNaN(num)) {
    const shortYear = num > 2000 ? String(num).slice(-2) : String(num);
    return `Batch of '${shortYear}`;
  }
  return str;
}

export function PeopleSection() {
  const [members, setMembers] = useState<PeopleMember[]>(INITIAL_PEOPLE_MEMBERS);
  const [selectedBatch, setSelectedBatch] = useState("ALL BATCHES");
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetch("/api/people")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.people) && data.people.length > 0) {
          setMembers(data.people);
        }
      })
      .catch(() => {});
  }, []);

  const dynamicBatchFilters = useMemo(() => {
    const batches = Array.from(new Set(members.map((m) => formatBatchYear(m.batch))));
    return ["ALL BATCHES", ...batches];
  }, [members]);

  const filteredPeople = useMemo(() => {
    if (selectedBatch === "ALL BATCHES") return members;
    return members.filter((person) => formatBatchYear(person.batch) === selectedBatch);
  }, [members, selectedBatch]);

  return (
    <section id="people" className="relative bg-[#0B0D19] py-24 border-b border-white/5 font-sans">
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
              <span className="text-[#FF355E]">KNIT</span>
            </Highlighter>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8C93B0] max-w-2xl mx-auto font-sans leading-relaxed">
            Spotlighting top cracked seniors, alumni, and high achievers driving engineering excellence across top tech companies worldwide.
          </p>
        </div>

        {/* Batch Year Filter Bar */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 border-b border-white/10">
            {dynamicBatchFilters.map((batch) => (
              <button
                key={batch}
                onClick={() => setSelectedBatch(batch)}
                className={`relative pb-4 -mb-[1px] text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  selectedBatch === batch ? "text-white" : "text-[#8C93B0] hover:text-white/80"
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

        {/* Original Cracked People Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <PeopleCard
              key={person._id || person.id}
              name={person.name}
              batch={person.batch}
              company={person.company}
              role={person.role}
              imageSrc={person.imageSrc}
              github={person.github}
              linkedin={person.linkedin}
              isPTSCAlumni={person.isPTSCAlumni}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
