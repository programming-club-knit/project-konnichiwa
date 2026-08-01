import Image from "next/image";
import { FiUser, FiGithub, FiLinkedin } from "react-icons/fi";

export type PositionHolder = {
  id: string;
  name: string;
  role: string;
  track: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
};

export const POSITION_HOLDERS: PositionHolder[] = [
  {
    id: "lead-1",
    name: "Bessie Cooper",
    role: "PTSC President",
    track: "Executive Lead",
    imageSrc: "/images/position-holder-1.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-2",
    name: "Marvin McKinney",
    role: "PTSC Vice President",
    track: "Executive Lead",
    imageSrc: "/images/position-holder-2.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-3",
    name: "Jane Cooper",
    role: "CP & Contest Lead",
    track: "CP Division",
    imageSrc: "/images/position-holder-3.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: "lead-4",
    name: "Brooklyn Simmons",
    role: "Web & App Lead",
    track: "Dev Division",
    imageSrc: "/images/position-holder-4.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="relative bg-[#0B0D19] py-24">
      {/* Vertical Dashed Guidelines Overlay matching template image */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        {/* Section Header matching exact screenshot typography */}
        <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-sans leading-tight">
          PTSC Position Holders &amp; Team Leads
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#8C93B0]">
          Vel fermentum potenti eros, blandit. Adipiscing turpis sit praesent massa imperdiet scelerisque amet magna. Ut in velit massa sit sed. Consequat.
        </p>

        {/* Member Cards Grid matching exact Playgame screenshot design */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {POSITION_HOLDERS.map((member) => (
            <div
              key={member.id}
              className="group flex flex-col justify-between"
            >
              {/* Card Image Container with exact Playgame styling */}
              <div className="relative aspect-[0.72] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C2038] via-[#15182C] to-[#0F1120] border border-white/10 transition-all duration-300 group-hover:border-[#FF355E]/50 flex flex-col items-center justify-center p-6 text-center shadow-lg">
                {/* Photo Placeholder Graphic Slot */}
                <div className="flex flex-col items-center justify-center gap-2 text-[#8C93B0] group-hover:text-white transition-colors">
                  <div className="grid size-16 place-items-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#FF355E]/10 group-hover:border-[#FF355E]/40 transition-colors">
                    <FiUser className="size-8 text-[#FF355E]" />
                  </div>
                  <span className="text-xs font-bold tracking-wide uppercase mt-2 text-white">
                    Photo Placeholder
                  </span>
                  <span className="text-[11px] font-mono text-[#8C93B0]">
                    {member.imageSrc}
                  </span>
                </div>

                {/* Bottom Left Watermark Badge matching template screenshot */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 opacity-90">
                  <Image
                    src="/logo.png"
                    alt="PTSC"
                    width={18}
                    height={18}
                    className="size-4 object-contain brightness-200"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 font-mono">
                    PTSC CLUB
                  </span>
                </div>
              </div>

              {/* Member Name & Role text below matching template screenshot */}
              <div className="mt-3.5 px-0.5">
                <h3 className="text-base font-extrabold text-[#9AA2FF] tracking-tight group-hover:text-white transition-colors font-sans">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-[#7177A1]">
                  {member.role}
                </p>

                {/* Social icons */}
                <div className="mt-2 flex items-center gap-3 text-[#7177A1]">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
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
                      className="transition-colors hover:text-white"
                      aria-label="LinkedIn Profile"
                    >
                      <FiLinkedin className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
