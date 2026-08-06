"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { FiGithub, FiLinkedin, FiMail, FiLoader } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";

export type ExecutiveMember = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  batch?: number | string;
  post?: string;
  role?: string;
  domain?: string;
  category?: string;
  imageSrc?: string;
  github?: string;
  linkedin?: string;
};

// Mock members structured across Final Year (2027), Third Year (2028), Second Year (2029), and Alumni batches

// Helper function to map batch/category to tier order and section header
function getLayerMetadata(batchNum?: number | string, category?: string) {
  const b = Number(batchNum);

  if (b === 2027 || category === "Final Year") {
    return { priority: 1, title: "Final Year Post Holders (Batch of 2027)", filterLabel: "Final Year ('27)" };
  }
  if (b === 2028 || category === "Third Year") {
    return { priority: 2, title: "Third Year Post Holders (Batch of 2028)", filterLabel: "Third Year ('28)" };
  }
  if (b === 2029 || category === "Second Year") {
    return { priority: 3, title: "Second Year Executive Members (Batch of 2029)", filterLabel: "Second Year ('29)" };
  }
  if (b && b <= 2026) {
    return {
      priority: 1000 - b,
      title: `Alumni & Past Post Holders — Batch of ${b}`,
      filterLabel: `Batch of '${String(b).slice(-2)}`
    };
  }
  return { priority: 999, title: "PTSC Executive Members", filterLabel: "Executives" };
}

export function TeamPageContent() {
  const [members, setMembers] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("All Members");
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.members)) {
          setMembers(data.members);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Compute available category tabs
  const availableTabs = useMemo(() => {
    const labels = new Set<string>();
    members.forEach((m) => {
      const meta = getLayerMetadata(m.batch, m.category);
      labels.add(meta.filterLabel);
    });
    return ["All Members", ...Array.from(labels)];
  }, [members]);

  // Filter members by selected tab
  const filteredMembers = useMemo(() => {
    if (selectedFilter === "All Members") return members;
    return members.filter((m) => {
      const meta = getLayerMetadata(m.batch, m.category);
      return meta.filterLabel === selectedFilter;
    });
  }, [members, selectedFilter]);

  // Group filtered members into strict layer hierarchy: Final Year -> Third Year -> Second Year -> Past Batches
  const groupedHierarchy = useMemo(() => {
    const groups: { [title: string]: { priority: number; list: ExecutiveMember[] } } = {};

    filteredMembers.forEach((m) => {
      const meta = getLayerMetadata(m.batch, m.category);
      if (!groups[meta.title]) {
        groups[meta.title] = { priority: meta.priority, list: [] };
      }
      groups[meta.title].list.push(m);
    });

    return Object.entries(groups).sort(([, a], [, b]) => a.priority - b.priority);
  }, [filteredMembers]);

  return (
    <div className="relative min-h-screen bg-[#0B0D19] py-24 selection:bg-[#FF355E]/30">
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
            The passionate minds and dedicated leaders driving technical excellence at KNIT Sultanpur
          </p>
        </div>

        {/* Category & Year Layer Filter Tabs */}
        {availableTabs.length > 1 && (
          <div className="flex justify-center mb-16">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 border-b border-white/10 pb-1">
              {availableTabs.map((tabLabel) => (
                <button
                  key={tabLabel}
                  type="button"
                  onClick={() => setSelectedFilter(tabLabel)}
                  className={`relative pb-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${selectedFilter === tabLabel
                    ? "text-white"
                    : "text-[#8C93B0] hover:text-white/80"
                    }`}
                >
                  {tabLabel}
                  {selectedFilter === tabLabel && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FF355E] shadow-[0_0_15px_rgba(255,53,94,0.6)] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center text-white/40 font-mono text-sm flex items-center justify-center gap-3 border border-white/10 rounded-2xl bg-[#121528]">
            <FiLoader className="size-6 animate-spin text-[#FF355E]" /> Loading team hierarchy...
          </div>
        ) : groupedHierarchy.length > 0 ? (
          /* Rendered Year-Wise Layer Sections in Order: 1) Final Year (2027) 2) Third Year (2028) 3) Second Year (2029) 4) Alumni */
          <div className="space-y-20">
            {groupedHierarchy.map(([sectionTitle, groupData]) => (
              <div key={sectionTitle} className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-sans">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#FF355E] shadow-[0_0_12px_#FF355E]" />
                    {sectionTitle}
                  </h2>
                  <span className="text-xs font-mono font-bold text-[#8C93B0] bg-white/5 border border-white/10 px-3.5 py-1 rounded-full">
                    {groupData.list.length} {groupData.list.length === 1 ? "Member" : "Members"}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {groupData.list.map((person, index) => {
                    const fullName = person.name || `${person.firstName || ""} ${person.lastName || ""}`.trim() || "PTSC Member";
                    const splitName = fullName.split(" ");
                    const firstName = splitName[0];
                    const lastName = splitName.slice(1).join(" ");
                    const userImage = person.imageSrc || "/teams/default-avatar.png";

                    return (
                      <div
                        key={person._id || person.id || index}
                        className="group relative overflow-hidden rounded-2xl bg-[#121528] border border-white/10 transition-all duration-300 hover:border-[#FF355E]/50 flex flex-col"
                      >
                        {/* Top Image Section */}
                        <div className="relative h-64 w-full overflow-hidden bg-[#0B0D19]">
                          <img
                            src={userImage}
                            alt={fullName}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#121528] to-transparent opacity-80" />
                        </div>

                        {/* Info Section */}
                        <div className="relative z-10 p-5 -mt-10 flex flex-col flex-1">
                          <div className="mb-1">
                            <span className="inline-block rounded bg-[#FF355E]/10 px-2 py-0.5 text-[10px] font-black text-[#FF355E] uppercase tracking-wider mb-2">
                              {person.batch ? `Batch of '${String(person.batch).slice(-2)}` : person.category || "Executive"}
                            </span>
                            <h3 className="text-2xl font-black text-white uppercase leading-none tracking-tight">
                              {firstName} <span className="text-white/70">{lastName}</span>
                            </h3>
                          </div>

                          <p className="text-sm font-bold text-[#FFB800] uppercase tracking-wide mt-2">
                            {person.post || person.role || "Executive Member"}
                          </p>
                          <p className="text-xs font-medium text-[#8C93B0] mt-1 line-clamp-1">
                            {person.domain || person.email || "KNIT Sultanpur"}
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
                            <a href={`mailto:${person.email || ""}`} className="text-white/60 hover:text-[#EA4335] transition-colors ml-auto">
                              <FiMail className="size-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
