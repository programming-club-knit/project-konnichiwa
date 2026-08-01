"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { Highlighter } from "@/components/ui/highlighter";
import { useScroll, useTransform, useSpring, motion } from "motion/react";
import gsap from "gsap";

export type PositionHolder = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
};

export function TeamSection() {
  const [members, setMembers] = useState<PositionHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const targetRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.members)) {
          const formatted: PositionHolder[] = data.members.map((m: any, idx: number) => ({
            id: m._id || `member-${idx}`,
            name: m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim() || "PTSC Member",
            role: m.post || m.role || "Executive Member",
            imageSrc: m.imageSrc || "/teams/default-avatar.png",
            github: m.github,
            linkedin: m.linkedin,
          }));
          setMembers(formatted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayMembers = members;

  // Pinned Section Scroll Progress (0 to 1 over 300vh scroll height)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Apply spring physics damping for liquid smooth scroll inertia & momentum
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.0001,
  });

  // Map spring-smoothed scroll progress to horizontal translation (0% to -54%)
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-54%"]);

  // Automatically focus on whichever card is at the center position based on smooth scroll progress
  useEffect(() => {
    if (displayMembers.length === 0) return;
    return smoothProgress.on("change", (latest) => {
      const activeIdx = Math.min(
        displayMembers.length - 1,
        Math.max(0, Math.round(latest * (displayMembers.length - 1)))
      );
      setHoveredIndex(activeIdx);
    });
  }, [smoothProgress, displayMembers.length]);

  // GSAP fluid 3D depth animation for centered card and neighboring cards
  useEffect(() => {
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;

      if (hoveredIndex === idx) {
        gsap.to(card, {
          scale: 1.15,
          y: -20,
          opacity: 1,
          zIndex: 30,
          duration: 0.5,
          ease: "power2.out",
        });
      } else if (hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1) {
        gsap.to(card, {
          scale: 0.95,
          y: -4,
          opacity: 0.8,
          zIndex: 20,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(card, {
          scale: 0.88,
          y: 0,
          opacity: 0.55,
          zIndex: 10,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  }, [hoveredIndex]);

  return (
    // Outer scroll track container defining the pin height (300vh)
    <div ref={targetRef} id="team" className="relative h-[300vh] bg-[#000]">
      {/* Sticky Pinned Screen Container */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden border-b border-white/5">
        
        {/* Vertical Dashed Guidelines Overlay */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
            <div className="border-r border-dashed border-white/5 h-full" />
            <div className="border-r border-dashed border-white/5 h-full" />
            <div className="border-r border-dashed border-white/5 h-full" />
            <div className="border-r border-dashed border-white/5 h-full" />
          </div>
        </div>

        {/* Section Header */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center mb-8">
          <h2 className="mx-auto max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl font-sans leading-[1.15]">
            Meet the team that makes the{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="font-serif italic font-normal text-white">
                magic happen
              </span>
            </Highlighter>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[#8C93B0]">
            From competitive coders to full-stack architects — meet the student leads driving technical excellence across KNIT Sultanpur.
          </p>
        </div>

        {/* Pinned Horizontal Scrolling Track with Spring Physics & GPU Acceleration */}
        <div className="relative z-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div style={{ x }} className="flex items-center gap-6 py-10 px-12 w-max transform-gpu will-change-transform">
            {displayMembers.map((member, index) => (
              <div
                key={member.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                className="group relative shrink-0 w-64 sm:w-72 overflow-hidden rounded-3xl bg-[#131627] border border-white/10 p-2.5 transition-colors duration-300 hover:border-[#FF355E]/60 cursor-pointer select-none transform-gpu"
              >
                {/* Photo Area */}
                <div className="relative aspect-[4/4.8] w-full overflow-hidden rounded-2xl bg-[#1A1D33]">
                  <Image
                    src={member.imageSrc || "/teams/default-avatar.png"}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Floating Bottom Glass Tag */}
                <div className="relative -mt-12 mx-2 mb-1.5 z-10 rounded-2xl bg-[#0B0D19]/90 backdrop-blur-md border border-white/15 p-3.5 text-center transition-all duration-300 group-hover:border-[#FF355E]/40">
                  <h3 className="text-base font-extrabold text-white tracking-tight font-sans">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-[#8C93B0]">
                    {member.role}
                  </p>

                  {/* Social Links */}
                  <div className="mt-2 flex items-center justify-center gap-3 text-[#8C93B0]">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-[#FF355E]"
                        aria-label="GitHub Profile"
                      >
                        <FiGithub className="size-3.5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-[#FF355E]"
                        aria-label="LinkedIn Profile"
                      >
                        <FiLinkedin className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
