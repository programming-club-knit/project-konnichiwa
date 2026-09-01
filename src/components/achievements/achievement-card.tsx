"use client";

import Image from "next/image";
import { FiAward } from "react-icons/fi";

export type AchievementItem = {
  event: string;
  status: string;
  category: string;
};

export type MemberAchievementCardProps = {
  id: string;
  name: string;
  imageSrc: string;
  achievements: AchievementItem[];
};

export function AchievementCard({
  id,
  name,
  imageSrc,
  achievements,
}: MemberAchievementCardProps) {
  return (
    <div
      key={id}
      className="group relative overflow-hidden rounded-3xl border border-white/20  bg-zinc-950 p-6 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.05] flex flex-col justify-between font-sans"
    >
      {/* Glass highlight */}
     
      <div className="relative">
        {/* Member Profile Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
          <div className="relative">
            <div className="relative size-14 overflow-hidden rounded-full border-2 border-white/20 bg-[#0B0D19] shrink-0">
              <Image
                src={imageSrc || "/teams/default-avatar.png"}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            {/* Medal Badge Overlay */}
            <div className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-[#FFB800] text-[#0B0D19] border-2 border-[#121526] shadow-md">
              <FiAward className="size-3.5 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-white tracking-tight font-sans">
              {name}
            </h3>
            <span className="text-xs font-semibold text-[#8C93B0]">
              {achievements.length} Verified Milestone
              {achievements.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* 2-Column Inner Achievement Grid */}
        <div className="grid grid-cols-2 gap-3 font-sans">
          {achievements.map((ach, idx) => (
            <div
              key={`ach-${id}-${idx}`}
              className="rounded-xl border border-white/20 bg-white/10 p-3 flex flex-col justify-center transition-colors backdrop-blur-md shadow-lg"
            >
              <span className="text-xs font-extrabold text-[#F47174] tracking-wide leading-tight">
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
  );
}
