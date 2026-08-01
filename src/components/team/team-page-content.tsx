"use client";

import { useState } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";

export type TeamMember = {
  id: string;
  name: string;
  category: string;
  role: string;
  domain: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
};

// Mock data structured by categories requested by user
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Aarav Sharma",
    category: "Post Holders",
    role: "President",
    domain: "Overall Management",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-2",
    name: "Riya Verma",
    category: "Post Holders",
    role: "Vice President",
    domain: "Technical Head",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-3",
    name: "Karan Singh",
    category: "Final Year",
    role: "Senior Executive",
    domain: "Web Development",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-4",
    name: "Meera Patel",
    category: "Final Year",
    role: "Senior Executive",
    domain: "AI/ML",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-5",
    name: "Dev Kumar",
    category: "Third Year",
    role: "Executive",
    domain: "Competitive Programming",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-6",
    name: "Ananya Gupta",
    category: "Third Year",
    role: "Executive",
    domain: "UI/UX Design",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-7",
    name: "Rahul Tiwari",
    category: "Second Year",
    role: "Volunteer",
    domain: "Open Source",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-8",
    name: "Neha Joshi",
    category: "Second Year",
    role: "Volunteer",
    domain: "App Development",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-9",
    name: "Saurabh Mishra",
    category: "Batch of '26",
    role: "Alumni Advisor",
    domain: "Cloud Infrastructure",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-10",
    name: "Vikas Chauhan",
    category: "Batch of '25",
    role: "Alumni Mentor",
    domain: "Cybersecurity",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "team-11",
    name: "Pooja Yadav",
    category: "Batch of '24",
    role: "Alumni Contributor",
    domain: "Data Science",
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export const TEAM_CATEGORIES = [
  "All Members",
  "Post Holders",
  "Final Year",
  "Third Year",
  "Second Year",
  "Batch of '26",
  "Batch of '25",
  "Batch of '24",
];

export function TeamPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("Post Holders");

  const filteredTeam =
    selectedCategory === "All Members"
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((person) => person.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-[#0B0D19] py-24">
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.15]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FF355E] opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans leading-tight">
            Meet the{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-[#FF355E]">Crew.</span>
            </Highlighter>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#8C93B0] max-w-3xl mx-auto font-sans leading-relaxed">
            The passionate minds and dedicated builders driving technical excellence and community growth at KNIT Sultanpur across all batches and domains.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 border-b border-white/10 pb-1">
            {TEAM_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative pb-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                  selectedCategory === category
                    ? "text-white"
                    : "text-[#8C93B0] hover:text-white/80"
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FF355E] shadow-[0_0_15px_rgba(255,53,94,0.6)] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        {filteredTeam.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTeam.map((person) => {
              const splitName = person.name.split(" ");
              const firstName = splitName[0];
              const lastName = splitName.slice(1).join(" ");

              return (
                <div
                  key={person.id}
                  className="group relative overflow-hidden rounded-2xl bg-[#121528] border border-white/10 transition-all duration-300 hover:border-[#FF355E]/50 flex flex-col"
                >
                  {/* Top Image Section */}
                  <div className="relative h-64 w-full overflow-hidden bg-[#0B0D19]">
                    <Image
                      src={person.imageSrc}
                      alt={person.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121528] to-transparent opacity-80" />
                  </div>

                  {/* Info Section */}
                  <div className="relative z-10 p-5 -mt-10 flex flex-col flex-1">
                    <div className="mb-1">
                      <span className="inline-block rounded bg-[#FF355E]/10 px-2 py-0.5 text-[10px] font-black text-[#FF355E] uppercase tracking-wider mb-2">
                        {person.category}
                      </span>
                      <h3 className="text-2xl font-black text-white uppercase leading-none tracking-tight">
                        {firstName} <span className="text-white/70">{lastName}</span>
                      </h3>
                    </div>

                    <p className="text-sm font-bold text-[#FFB800] uppercase tracking-wide mt-2">
                      {person.role}
                    </p>
                    <p className="text-xs font-medium text-[#8C93B0] mt-1 line-clamp-1">
                      {person.domain}
                    </p>

                    {/* Socials Footer */}
                    <div className="mt-auto pt-6 flex items-center gap-4">
                      {person.github && (
                        <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                          <FiGithub className="size-4" />
                        </a>
                      )}
                      {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#0077b5] transition-colors">
                          <FiLinkedin className="size-4" />
                        </a>
                      )}
                      <a href="#" className="text-white/60 hover:text-[#EA4335] transition-colors ml-auto">
                        <FiMail className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-[#8C93B0] font-mono text-sm uppercase tracking-widest">No members found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
