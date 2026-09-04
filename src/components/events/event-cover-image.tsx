"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiCpu, FiCode, FiTerminal, FiAward, FiActivity } from "react-icons/fi";

interface EventCoverImageProps {
  src?: string | null;
  alt: string;
  title?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  variant?: "card" | "hero" | "spotlight";
}

const THEMES = [
  {
    gradient: "from-[#110e24] via-[#1a1236] to-[#0a0d1d]",
    glow: "radial-gradient(circle at 60% 40%, rgba(255, 53, 94, 0.22) 0%, transparent 65%)",
    badgeBorder: "border-[#FF355E]/30",
    badgeBg: "bg-[#FF355E]/10 text-[#FF7597]",
    icon: FiTerminal,
    chipText: "PTSC CODING ARENA",
    patternColor: "rgba(255, 53, 94, 0.12)",
  },
  {
    gradient: "from-[#071927] via-[#0d273d] to-[#050e18]",
    glow: "radial-gradient(circle at 60% 40%, rgba(56, 189, 248, 0.22) 0%, transparent 65%)",
    badgeBorder: "border-sky-500/30",
    badgeBg: "bg-sky-500/10 text-sky-300",
    icon: FiCode,
    chipText: "PTSC HACKATHON",
    patternColor: "rgba(56, 189, 248, 0.12)",
  },
  {
    gradient: "from-[#150a24] via-[#24103d] to-[#0a0614]",
    glow: "radial-gradient(circle at 60% 40%, rgba(168, 85, 247, 0.22) 0%, transparent 65%)",
    badgeBorder: "border-purple-500/30",
    badgeBg: "bg-purple-500/10 text-purple-300",
    icon: FiCpu,
    chipText: "PTSC TECH WORKSHOP",
    patternColor: "rgba(168, 85, 247, 0.12)",
  },
  {
    gradient: "from-[#081a17] via-[#0e2c26] to-[#05110f]",
    glow: "radial-gradient(circle at 60% 40%, rgba(52, 211, 153, 0.22) 0%, transparent 65%)",
    badgeBorder: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10 text-emerald-300",
    icon: FiActivity,
    chipText: "PTSC BOOTCAMP",
    patternColor: "rgba(52, 211, 153, 0.12)",
  },
  {
    gradient: "from-[#211012] via-[#33181a] to-[#12080a]",
    glow: "radial-gradient(circle at 60% 40%, rgba(244, 113, 116, 0.22) 0%, transparent 65%)",
    badgeBorder: "border-rose-500/30",
    badgeBg: "bg-rose-500/10 text-rose-300",
    icon: FiAward,
    chipText: "PTSC FLAGSHIP EVENT",
    patternColor: "rgba(244, 113, 116, 0.12)",
  },
];

function getDeterministicThemeIndex(str?: string): number {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % THEMES.length;
}

export function EventCoverImage({
  src,
  alt,
  title,
  className = "",
  fill = true,
  priority = false,
  sizes = "(max-width: 1200px) 100vw, 50vw",
  variant = "card",
}: EventCoverImageProps) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgError(false);
    setIsLoaded(false);
  }, [src]);

  const displayTitle = title || alt || "PTSC Tech Event";
  const themeIndex = getDeterministicThemeIndex(displayTitle);
  const theme = THEMES[themeIndex];
  const IconComponent = theme.icon;

  const showImage = Boolean(src && !imgError && src.trim().length > 0);

  return (
    <div className="relative size-full overflow-hidden bg-[#090B14]">
      {/* Fallback Graphic UI (Visible while image loads or whenever image fails/is missing) */}
      <div
        className={`absolute inset-0 size-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${theme.gradient} select-none overflow-hidden`}
      >
        {/* Glow ambient circle */}
        <div
          className="pointer-events-none absolute inset-0 size-full opacity-80"
          style={{ background: theme.glow }}
        />

        {/* Vector Grid & Cyber Lines */}
        <svg
          className="pointer-events-none absolute inset-0 size-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`grid-pattern-${themeIndex}`}
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#grid-pattern-${themeIndex})`}
          />
          <line
            x1="0"
            y1="25%"
            x2="100%"
            y2="75%"
            stroke={theme.patternColor}
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <line
            x1="100%"
            y1="35%"
            x2="0"
            y2="85%"
            stroke={theme.patternColor}
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Decorative corner reticles */}
        <span className="absolute top-3 left-3 text-[10px] font-mono text-white/20 select-none">
          +
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-mono text-white/20 select-none">
          +
        </span>
        <span className="absolute bottom-3 left-3 text-[10px] font-mono text-white/20 select-none">
          +
        </span>
        <span className="absolute bottom-3 right-3 text-[10px] font-mono text-white/20 select-none">
          +
        </span>

        {/* Central Branded Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[85%] space-y-2.5">
          {/* Tech Emblem Badge */}
          <div
            className={`grid size-12 place-items-center rounded-2xl bg-white/5 border ${theme.badgeBorder} shadow-lg backdrop-blur-md ${
              variant === "hero" ? "sm:size-16" : ""
            }`}
          >
            <IconComponent
              className={`size-6 ${theme.badgeBg.split(" ")[1]} ${
                variant === "hero" ? "sm:size-8" : ""
              }`}
            />
          </div>

          {/* Sub-label */}
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/40 uppercase">
            {theme.chipText}
          </span>

          {/* Event Title in Fallback */}
          <p
            className={`font-extrabold text-white tracking-tight leading-snug drop-shadow-md ${
              variant === "hero"
                ? "text-xl sm:text-3xl max-w-xl"
                : variant === "spotlight"
                ? "text-base sm:text-xl line-clamp-2"
                : "text-sm sm:text-base line-clamp-2"
            }`}
          >
            {displayTitle}
          </p>
        </div>
      </div>

      {/* Actual Image Rendered on Top with Error Handler */}
      {showImage && (
        <Image
          src={src!}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes}
          onError={() => setImgError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`object-cover transition-all duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}
