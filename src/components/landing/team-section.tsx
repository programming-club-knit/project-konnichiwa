"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";
import gsap from "gsap";

export type PositionHolder = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
};

export const POSITION_HOLDERS: PositionHolder[] = [
  {
    id: "lead-1",
    name: "Ishaan Pandey",
    role: "President & Lead",
    imageSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-2",
    name: "Alex",
    role: "Vice President",
    imageSrc:
      "https://images.unsplash.com/photo-1613310023042-ad79320c00ff?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-3",
    name: "Sarah",
    role: "Head of CP Division",
    imageSrc: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-4",
    name: "Ken",
    role: "Lead Web Developer",
    imageSrc:
      "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-5",
    name: "Yui",
    role: "Product & UI/UX",
    imageSrc:
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-6",
    name: "Taro",
    role: "VP of Operations",
    imageSrc:
      "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-7",
    name: "Mia",
    role: "Backend Architect",
    imageSrc:
      "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-8",
    name: "Ryu",
    role: "Mobile App Lead",
    imageSrc:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export function TeamSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const progress = container.scrollLeft / maxScroll;
      const activeIdx = Math.min(
        POSITION_HOLDERS.length - 1,
        Math.max(0, Math.round(progress * (POSITION_HOLDERS.length - 1))),
      );
      setHoveredIndex(activeIdx);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;

      if (hoveredIndex === idx) {
        gsap.to(card, {
          scale: 1.1,
          y: -10,
          rotate: 0,
          opacity: 1,
          zIndex: 30,
          duration: 0.5,
          ease: "back.out(1.2)",
        });
      } else if (hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1) {
        gsap.to(card, {
          scale: 0.95,
          y: 0,
          rotate: (hoveredIndex - idx) * 2,
          opacity: 0.8,
          zIndex: 20,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(card, {
          scale: 0.88,
          y: 5,
          rotate: idx % 2 === 0 ? 4 : -4,
          opacity: 0.55,
          zIndex: 10,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  }, [hoveredIndex]);

  return (
    <div
      ref={targetRef}
      id="team"
      className="relative bg-transparent py-24 border-b border-white/5 overflow-hidden"
    >
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40"></div>

      <div className="relative z-10 flex flex-col gap-12">
        {/* Section Header with tighter spacing */}
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-mono font-bold text-[#F47174] uppercase tracking-widest mb-1.5">
            Character Select
          </p>
          <h2 className="mx-auto max-w-4xl text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl font-sans leading-tight">
            Meet the heroes behind the{" "}
            <Highlighter action="underline" color="#F47174" strokeWidth={4}>
              <span className="font-serif italic font-normal text-white">
                magic
              </span>
            </Highlighter>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#8C93B0]">
            The student leads driving technical excellence across KNIT
            Sultanpur.
          </p>
        </div>

        {/* Scrollable Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="relative z-10 w-full overflow-x-auto scrollbar-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]  py-6 select-none"
        >
          <div
            ref={trackRef}
            className="flex items-center gap-8 py-6 px-12 w-max transform-gpu"
          >
            {POSITION_HOLDERS.map((member, index) => (
              <div
                key={member.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                className="relative rounded-2xl flex-shrink-0 w-72"
              >
                {/* Anime Sticker/Badge overlay */}
                <div className="absolute -top-3 -right-3 z-20 size-10 rounded-4xl bg-[#0f0f0f] text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-[#1A1033] transform rotate-12 group-hover:scale-110 transition-transform">
                  👾
                </div>

                <div className="relative aspect-[4/5] w-full overflow-visible rounded-2xl bg-[#090A14] border border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent  to-transparent opacity-50 z-10 mix-blend-overlay" />
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 224px, 256px"
                  />

                  {/* Character Name Overlay (Anime Style) */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#090A14] via-[#090A14]/80 to-transparent z-20">
                    <h3 className="text-xl font-black text-white tracking-tight font-sans drop-shadow-md">
                      {member.name}
                    </h3>
                    <div className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#00F0FF]">
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Social Tag (adjusted distance to avoid cut-off) */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-full bg-[#0f0f0f] backdrop-blur-xl border-2 border-white/15 px-5 py-2 text-center transition-all duration-300 group-hover:border-[#F47174]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3.5 text-white">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all hover:text-[#00F0FF] hover:scale-125"
                      >
                        <FiGithub className="size-3.5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all hover:text-[#00F0FF] hover:scale-125"
                      >
                        <FiLinkedin className="size-3.5" />
                      </a>
                    )}
                    <a
                      href="#"
                      className="transition-all hover:text-[#00F0FF] hover:scale-125"
                    >
                      <FiTwitter className="size-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
