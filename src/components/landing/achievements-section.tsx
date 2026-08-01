"use client";

import { useState } from "react";
import Image from "next/image";
import { FiSearch, FiAward } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";

export type AchievementItem = {
  event: string;
  status: string;
  category: string;
};

export type MemberAchievementCard = {
  id: string;
  name: string;
  imageSrc: string;
  achievements: AchievementItem[];
};

export const ACHIEVEMENTS_DATA: MemberAchievementCard[] = [
  {
    id: "akash-singh",
    name: "Akash Singh",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '24", status: "@Keploy", category: "GSOC" },
      { event: "LFX '25", status: "@LitmusChaos", category: "LFX" },
      { event: "SIH '25", status: "Winner", category: "SIH" },
      { event: "ICPC '25", status: "Regional Finalist", category: "ICPC" },
      { event: "HackGlobal Singapore", status: "Finalists", category: "HACKATHONS" },
      { event: "NITK '25", status: "Grand Winner", category: "HACKATHONS" },
      { event: "Warpspeed", status: "Grand Winner", category: "HACKATHONS" },
      { event: "Hackbangalore '25", status: "Winner", category: "HACKATHONS" },
    ],
  },
  {
    id: "inchara-j",
    name: "Inchara J",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '26", status: "@Kornia", category: "GSOC" },
      { event: "SIH '24", status: "Winner", category: "SIH" },
      { event: "SIH '25", status: "Winner", category: "SIH" },
      { event: "ICPC '25", status: "Rank #14", category: "ICPC" },
      { event: "HackNocturne", status: "Winner", category: "HACKATHONS" },
      { event: "Warpspeed", status: "Winner", category: "HACKATHONS" },
    ],
  },
  {
    id: "kamini-banait",
    name: "Kamini Banait",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '26", status: "@LLVM", category: "GSOC" },
      { event: "SIH '24", status: "Winner", category: "SIH" },
      { event: "SIH '25", status: "Winner", category: "SIH" },
      { event: "HackToFuture", status: "Winner", category: "HACKATHONS" },
      { event: "Cellstrat Cellverse", status: "Hackathon Winner", category: "HACKATHONS" },
      { event: "Aventus 3.0", status: "Track Winner", category: "HACKATHONS" },
    ],
  },
  {
    id: "abhay-pratap",
    name: "Abhay Pratap",
    imageSrc: "/teams/pfp.jpg",
    achievements: [
      { event: "GSoC '25", status: "@AsyncAPI", category: "GSOC" },
      { event: "LFX '24", status: "@CNCF", category: "LFX" },
      { event: "SIH '24", status: "Grand Winner", category: "SIH" },
      { event: "ACM Winter School '24", status: "Selected Scholar", category: "ACM" },
      { event: "CodeChef '25", status: "5★ Candidate Master", category: "CP" },
      { event: "Smart India Hackathon", status: "1st Position", category: "SIH" },
    ],
  },
];

export const FILTER_CATEGORIES = [
  "ALL",
  "HACKATHONS",
  "GSOC",
  "LFX",
  "SIH",
  "ICPC",
  "ACM",
  "CP",
];

export function AchievementsSection() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = ACHIEVEMENTS_DATA.map((member) => {
    // Filter achievements per member based on active category & search query
    const matchingAchievements = member.achievements.filter((ach) => {
      const matchesCategory =
        activeFilter === "ALL" || ach.category === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.status.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return {
      ...member,
      achievements: matchingAchievements,
    };
  }).filter((member) => member.achievements.length > 0);

  return (
    <section id="achievements" className="relative bg-[#0B0D19] py-24 border-b border-white/5">
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
        {/* Main Section Header matching reference image */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans leading-tight">
            We Build. We Ship.{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-[#FF355E]">We Win.</span>
            </Highlighter>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#8C93B0] max-w-xl mx-auto font-sans">
            A showcase of achievements by the talented members of PTSC
          </p>
        </div>

        {/* Filter Pills + Search Input Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`rounded-full px-5 py-2 text-xs font-black tracking-wider transition-all duration-200 ${
                activeFilter === category
                  ? "bg-[#FF355E] text-white shadow-none"
                  : "bg-white/5 text-[#8C93B0] border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}

          {/* Search Input Box */}
          <div className="relative ml-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8C93B0]" />
            <input
              type="text"
              placeholder="Search member or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-xs font-semibold text-white placeholder-[#8C93B0] outline-none focus:border-[#FF355E] transition-colors w-44 sm:w-56"
            />
          </div>
        </div>

        {/* Member Cards Grid matching Screenshot */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-3xl bg-[#121526] border border-white/10 p-6 transition-all duration-300 hover:border-[#FF355E]/50 flex flex-col justify-between"
            >
              <div>
                {/* Member Profile Header */}
                <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
                  <div className="relative">
                    <div className="relative size-14 overflow-hidden rounded-full border-2 border-white/20">
                      <Image
                        src={member.imageSrc}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Medal Badge Overlay */}
                    <div className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-[#FFB800] text-[#0B0D19] border-2 border-[#121526] shadow-md">
                      <FiAward className="size-3.5 stroke-[2.5]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight font-sans">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#8C93B0]">
                      {member.achievements.length} Verified Milestones
                    </span>
                  </div>
                </div>

                {/* 2-Column Inner Achievement Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {member.achievements.map((ach, idx) => (
                    <div
                      key={`ach-${member.id}-${idx}`}
                      className="rounded-xl bg-[#0B0D19]/80 border border-white/5 p-3 flex flex-col justify-center transition-colors hover:border-[#FF355E]/30"
                    >
                      <span className="text-xs font-extrabold text-[#FF355E] tracking-wide leading-tight">
                        {ach.event}
                      </span>
                      <span className="text-[11px] font-semibold text-[#8C93B0] mt-1 leading-tight">
                        {ach.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
