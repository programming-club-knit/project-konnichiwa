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


const POST_RANKS: Record<string, number> = {
  "Secretary": 1,
  "Joint Secretary": 2,
  "Competitive Programming Head": 3,
  "Web Development Head": 4,
  "Data Science Head": 5,
  "GenAI Head": 6,
  "App Dev Head": 7,
  "Media and Design Head": 8,
  "Event Head": 9,
  "Class Mentor": 10,
  "Executive members": 20,
};

// Helper function to map batch/category to tier order and section header
function getLayerMetadata(batchNum?: number | string, category?: string) {
  const b = Number(batchNum);

  // 1. Final Year Post Holders (Batch 2026)
  if (b === 2026 || category === "Final Year") {
    return { priority: 1, title: "Final Year Post Holders (Batch of 2026)", filterLabel: "Final Year ('26)" };
  }
  // 2. Third Year Post Holders (Batch 2027)
  if (b === 2027 || category === "Third Year") {
    return { priority: 2, title: "Third Year Post Holders (Batch of 2027)", filterLabel: "Third Year ('27)" };
  }
  // 3. Second Year / Core Executive Members (Batch 2028)
  if (b === 2028 || category === "Executive" || category === "Second Year") {
    return { priority: 3, title: "Executive Members (Batch of 2028)", filterLabel: "Executives ('28)" };
  }
  // 4. Future / Junior Batches
  if (b >= 2029) {
    return { priority: 4 + (b - 2029), title: `Junior Executives (Batch of ${b})`, filterLabel: `Batch of '${String(b).slice(-2)}` };
  }
  // 5. Alumni & Past Post Holders (Descending from latest alumni year: 2025 -> 2024 -> 2023...)
  if (b && b <= 2025) {
    return {
      priority: 100 + (2025 - b), // 2025 gets 100, 2024 gets 101, 2023 gets 102 (latest alumni year first)
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
  // Initial state: All batches collapsed by default
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
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

  // Compute available category tabs in exact priority order
  const availableTabs = useMemo(() => {
    const tabMap = new Map<string, number>();
    members.forEach((m) => {
      const meta = getLayerMetadata(m.batch, m.category);
      if (!tabMap.has(meta.filterLabel)) {
        tabMap.set(meta.filterLabel, meta.priority);
      }
    });
    const sortedTabs = Array.from(tabMap.entries())
      .sort(([, a], [, b]) => a - b)
      .map(([label]) => label);

    return ["All Members", ...sortedTabs];
  }, [members]);

  // Filter members by selected tab
  const filteredMembers = useMemo(() => {
    if (selectedFilter === "All Members") return members;
    return members.filter((m) => {
      const meta = getLayerMetadata(m.batch, m.category);
      return meta.filterLabel === selectedFilter;
    });
  }, [members, selectedFilter]);

  // Group filtered members into strict layer hierarchy:
  // Final Year -> Third Year -> Executive Members -> Latest Alumni Batches (2025, 2024...)
  const groupedHierarchy = useMemo(() => {
    const groups: { [title: string]: { priority: number; list: ExecutiveMember[] } } = {};

    filteredMembers.forEach((m) => {
      const meta = getLayerMetadata(m.batch, m.category);
      if (!groups[meta.title]) {
        groups[meta.title] = { priority: meta.priority, list: [] };
      }
      groups[meta.title].list.push(m);
    });

    // Sort groups by priority, and inside each group sort members by post leadership rank then first name
    return Object.entries(groups)
      .sort(([, a], [, b]) => a.priority - b.priority)
      .map(([title, group]) => {
        const sortedList = [...group.list].sort((a, b) => {
          const rankA = a.post ? (POST_RANKS[a.post] || 50) : 60;
          const rankB = b.post ? (POST_RANKS[b.post] || 50) : 60;
          if (rankA !== rankB) return rankA - rankB;
          return (a.firstName || a.name || "").localeCompare(b.firstName || b.name || "");
        });
        return [title, { ...group, list: sortedList }] as [string, { priority: number; list: ExecutiveMember[] }];
      });
  }, [filteredMembers]);

  // Toggle individual section expansion
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // Toggle all sections
  const allExpanded = groupedHierarchy.length > 0 && groupedHierarchy.every(([title]) => expandedSections[title]);
  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedSections({});
    } else {
      const nextOpen: Record<string, boolean> = {};
      groupedHierarchy.forEach(([title]) => {
        nextOpen[title] = true;
      });
      setExpandedSections(nextOpen);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] py-24 selection:bg-[#FF355E]/30 font-sans">
      {/* Vertical Dashed Guidelines Overlay matching /people */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
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

        {/* Filter Tabs & Expand/Collapse Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 border-b border-white/10 pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            {availableTabs.map((tabLabel) => (
              <button
                key={tabLabel}
                type="button"
                onClick={() => {
                  setSelectedFilter(tabLabel);
                  // When selecting a specific batch, auto-expand it for instant view
                  if (tabLabel !== "All Members") {
                    const allOpen: Record<string, boolean> = {};
                    groupedHierarchy.forEach(([title]) => {
                      allOpen[title] = true;
                    });
                    setExpandedSections(allOpen);
                  }
                }}
                className={`relative pb-2 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-200 ${
                  selectedFilter === tabLabel
                    ? "text-white"
                    : "text-[#8C93B0] hover:text-white"
                }`}
              >
                {tabLabel}
                {selectedFilter === tabLabel && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FF355E] shadow-[0_0_12px_rgba(255,53,94,0.6)] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Expand/Collapse All Button */}
          {groupedHierarchy.length > 0 && (
            <button
              type="button"
              onClick={handleToggleAll}
              className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              {allExpanded ? "Collapse All Batches" : "Expand All Batches"}
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center text-white/40 font-mono text-sm flex items-center justify-center gap-3 border border-white/10 rounded-2xl bg-[#141414]">
            <FiLoader className="size-6 animate-spin text-[#FF355E]" /> Loading team hierarchy...
          </div>
        ) : groupedHierarchy.length > 0 ? (
          /* Collapsible Year-Wise Layer Sections */
          <div className="space-y-6">
            {groupedHierarchy.map(([sectionTitle, groupData]) => {
              const isExpanded = Boolean(expandedSections[sectionTitle]);

              return (
                <div
                  key={sectionTitle}
                  className="rounded-2xl border border-white/10 bg-[#141414]/80 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/20"
                >
                  {/* Collapsible Section Header Bar */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sectionTitle)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group focus:outline-none transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`h-3.5 w-3.5 rounded-full transition-transform duration-300 ${
                        isExpanded ? 'bg-[#FF355E] shadow-[0_0_12px_#FF355E] scale-110' : 'bg-white/30'
                      }`} />
                      <h2 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight font-sans truncate">
                        {sectionTitle}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs font-mono font-bold text-[#8C93B0] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {groupData.list.length} {groupData.list.length === 1 ? "Member" : "Members"}
                      </span>
                      <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 text-slate-400 group-hover:text-white transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-[#FF355E] bg-[#FF355E]/10 border-[#FF355E]/30' : ''
                      }`}>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expandable Member Cards Grid */}
                  {isExpanded && (
                    <div className="p-6 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                        {groupData.list.map((person, index) => {
                          const fullName = person.name || `${person.firstName || ""} ${person.lastName || ""}`.trim() || "PTSC Member";
                          const splitName = fullName.split(" ");
                          const firstName = splitName[0];
                          const lastName = splitName.slice(1).join(" ");
                          const userImage = person.imageSrc || "/teams/default-avatar.png";

                          return (
                            <div
                              key={person._id || person.id || index}
                              className="group/card relative overflow-hidden rounded-2xl bg-[#141414] border border-white/10 transition-all duration-300 hover:border-[#FF355E]/50 flex flex-col shadow-lg"
                            >
                              {/* Top Image Section */}
                              <div className="relative h-64 w-full overflow-hidden bg-[#1a1a1a]">
                                <img
                                  src={userImage}
                                  alt={fullName}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent opacity-90" />
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
                                <div className="mt-auto pt-6 flex items-center gap-4 border-t border-white/5">
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
                  )}
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
