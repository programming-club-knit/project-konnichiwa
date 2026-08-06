"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { FiSearch, FiLoader } from "react-icons/fi";
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

export const INITIAL_ACHIEVEMENTS_DATA: MemberAchievementCard[] = [
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
    ],
  },
];

export function AchievementsSection() {
  const [cards, setCards] = useState<MemberAchievementCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetch("/api/achievements")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.cards) && data.cards.length > 0) {
          setCards(data.cards);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Dynamically derive categories from active cards
  const filterCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    cards.forEach((card) => {
      card.achievements.forEach((ach) => {
        if (ach.category) categoriesSet.add(ach.category.toUpperCase());
      });
    });
    return ["ALL", ...Array.from(categoriesSet)];
  }, [cards]);

  const filteredMembers = useMemo(() => {
    return cards
      .map((member) => {
        const matchingAchievements = member.achievements.filter((ach) => {
          const matchesCategory =
            activeFilter === "ALL" || ach.category?.toUpperCase() === activeFilter;
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
      })
      .filter((member) => member.achievements.length > 0);
  }, [cards, activeFilter, searchQuery]);

  return (
    <section id="achievements" className="relative bg-[#0B0D19] py-24 border-b border-white/5 font-sans">
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
        {/* Main Section Header */}
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
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14 font-sans">
          {filterCategories.map((category) => (
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

        {/* Exact Original Member Cards Grid */}
        {loading ? (
          <div className="p-16 text-center border border-white/10 rounded-3xl bg-[#121526] text-white/50 text-xs font-mono flex items-center justify-center gap-2">
            <FiLoader className="size-5 animate-spin text-[#FF355E]" /> Loading showcase achievements...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-16 text-center border border-white/10 rounded-3xl bg-[#121526] text-[#8C93B0] text-sm font-sans">
            No achievement cards found matching your filter criteria.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 font-sans">
            {filteredMembers.map((member) => (
              <AchievementCard
                key={member.id}
                id={member.id}
                name={member.name}
                imageSrc={member.imageSrc}
                achievements={member.achievements}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
