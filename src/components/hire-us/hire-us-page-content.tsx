"use client";

import { useState } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiFileText, FiBriefcase, FiExternalLink } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";

export type TalentMember = {
  id: string;
  name: string;
  availability: "Internship" | "Full-time" | "Freelance";
  role: string;
  domain: string;
  skills: string[];
  imageSrc: string;
  github?: string;
  linkedin?: string;
  resume?: string;
  portfolio?: string;
};

// Mock data for talent available for hire
export const AVAILABLE_TALENT: TalentMember[] = [
  {
    id: "talent-1",
    name: "Rohan Patel",
    availability: "Internship",
    role: "Frontend Engineer",
    domain: "Web Development",
    skills: ["React", "Next.js", "Tailwind", "TypeScript"],
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    resume: "#",
    portfolio: "https://example.com",
  },
  {
    id: "talent-2",
    name: "Sakshi Jain",
    availability: "Full-time",
    role: "Backend Developer",
    domain: "Backend Systems",
    skills: ["Node.js", "Go", "PostgreSQL", "Docker"],
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "talent-3",
    name: "Aditya Sharma",
    availability: "Internship",
    role: "AI/ML Engineer",
    domain: "Machine Learning",
    skills: ["Python", "PyTorch", "TensorFlow", "NLP"],
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    resume: "#",
    portfolio: "https://example.com",
  },
  {
    id: "talent-4",
    name: "Priya Desai",
    availability: "Full-time",
    role: "Full-Stack Engineer",
    domain: "Software Engineering",
    skills: ["MERN Stack", "AWS", "GraphQL", "Redis"],
    imageSrc: "/teams/pfp.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    resume: "#",
  },
  {
    id: "talent-5",
    name: "Amit Kumar",
    availability: "Freelance",
    role: "UI/UX Designer",
    domain: "Design",
    skills: ["Figma", "Framer", "Prototyping", "User Research"],
    imageSrc: "/teams/pfp.jpg",
    linkedin: "https://linkedin.com",
    portfolio: "https://example.com",
  },
];

export const TALENT_FILTERS = [
  "All Talent",
  "Internship",
  "Full-time",
  "Freelance",
];

export function HireUsPageContent() {
  const [selectedFilter, setSelectedFilter] = useState("All Talent");

  const filteredTalent =
    selectedFilter === "All Talent"
      ? AVAILABLE_TALENT
      : AVAILABLE_TALENT.filter((person) => person.availability === selectedFilter);

  return (
    <div className="relative min-h-screen bg-[#0B0D19] py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans leading-tight">
            Hire Our{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-[#FF355E]">Talent.</span>
            </Highlighter>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#8C93B0] max-w-3xl mx-auto font-sans leading-relaxed">
            Discover top-tier engineers, designers, and developers from KNIT Sultanpur actively seeking internships, full-time roles, and freelance opportunities.
          </p>
          
          <div className="mt-8">
            <a href="mailto:contact@ptsc.knit.ac.in" className="inline-flex items-center gap-2 bg-white text-black font-black uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1">
              <FiBriefcase className="size-5" /> Partner with Us
            </a>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap justify-center items-center rounded-full border border-white/10 bg-[#121528] p-1.5 backdrop-blur-md shadow-2xl">
            {TALENT_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`relative rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                  selectedFilter === filter
                    ? "bg-[#FF355E] text-white shadow-[0_0_20px_rgba(255,53,94,0.3)]"
                    : "text-[#8C93B0] hover:text-white hover:bg-white/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Talent Grid */}
        {filteredTalent.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTalent.map((person) => {
              const availabilityColor = 
                person.availability === "Internship" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : 
                person.availability === "Full-time" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                "bg-purple-500/10 text-purple-400 border-purple-500/20";

              return (
                <div
                  key={person.id}
                  className="group relative overflow-hidden rounded-2xl bg-[#121528] border border-white/10 transition-all duration-300 hover:border-white/30 flex flex-col p-6 shadow-xl"
                >
                  {/* Top Header: Image & Name */}
                  <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-white/10 group-hover:border-[#FF355E] transition-colors">
                      <Image
                        src={person.imageSrc}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#FF355E] transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-sm font-semibold text-white/70 mt-0.5">
                        {person.role}
                      </p>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${availabilityColor}`}>
                      Open for {person.availability}
                    </span>
                  </div>

                  {/* Skills Grid */}
                  <div className="mb-6 flex-1">
                    <p className="text-xs font-bold text-[#8C93B0] uppercase tracking-wider mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {person.skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 text-xs font-medium text-white/80 bg-white/5 border border-white/10 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {person.github && (
                        <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors p-1" title="GitHub">
                          <FiGithub className="size-4" />
                        </a>
                      )}
                      {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#0077b5] transition-colors p-1" title="LinkedIn">
                          <FiLinkedin className="size-4" />
                        </a>
                      )}
                      {person.portfolio && (
                        <a href={person.portfolio} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors p-1" title="Portfolio">
                          <FiExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                    
                    {person.resume && (
                      <a href={person.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-[#FF355E] uppercase tracking-wider hover:text-white transition-colors">
                        <FiFileText className="size-3.5" /> Resume
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-[#8C93B0] font-mono text-sm uppercase tracking-widest">No candidates found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
