import Image from "next/image";
import { Highlighter } from "@/components/ui/highlighter";

export type ActivityItem = {
  id: string;
  title: string;
  badge: string;
  description: string;
  imageSrc?: string;
};

export const ACTIVITIES: ActivityItem[] = [
  {
    id: "cp-contests",
    title: "CP Contests",
    badge: "PTSC Hustle",
    description:
      "Since 2019, PTSC has built a strong competitive programming culture. Participation scaled rapidly, with teams qualifying for ICPC Regionals.",
    imageSrc: "/teams/pfp.jpg",
  },
  {
    id: "development",
    title: "Development",
    badge: "PTSC Chronicles",
    description:
      "We host hands-on workshops across web, mobile, DevOps, machine learning, and open source, focused on real skills rather than slides.",
    imageSrc: "/teams/pfp.jpg",
  },
  {
    id: "hackathons",
    title: "Hackathons",
    badge: "Smart India Hackathon",
    description:
      "PTSC organizes the internal Smart India Hackathon annually, with consistent national qualifications, finals, and wins.",
    imageSrc: "/teams/pfp.jpg",
  },
  {
    id: "open-source",
    title: "Open Source",
    badge: "GSoC",
    description:
      "Our open-source community has produced GSoC contributors, LFX scholars, and GitHub Externs across top global tech organizations.",
    imageSrc: "/teams/pfp.jpg",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    badge: "PTSCTF",
    description:
      "We run hands-on cybersecurity sessions and host PTSCTF, an in-house Capture The Flag event with wide campus-wide student participation.",
    imageSrc: "/teams/pfp.jpg",
  },
  {
    id: "innovation",
    title: "Innovation",
    badge: "Research",
    description:
      "From hardware prototypes to published research, we foster a strong culture of experimentation and innovation beyond the classroom.",
    imageSrc: "/teams/pfp.jpg",
  },
];

export function ActivitiesSection() {
  return (
    <section id="activities" className="relative bg-[#000] py-24 border-b border-white/5">
      {/* Vertical Dashed Guidelines Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
            Our Key{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-white">Activities</span>
            </Highlighter>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8C93B0] max-w-xl mx-auto font-sans leading-relaxed">
            Explore the core technical tracks and student initiatives powering PTSC across campus.
          </p>
        </div>

        {/* Clean Grid Layout (rounded-none, no icons, no track tags, no bottom link, uniform text length) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="group relative rounded-none bg-[#111425] border border-white/10 p-5 transition-all duration-300 hover:border-[#FF355E] hover:border-l-4 hover:border-l-[#FF355E] flex flex-col justify-between"
            >
              <div>
                {/* Photo Banner with Zero Radius */}
                <div className="relative aspect-[16/10] w-full rounded-none overflow-hidden bg-[#1A1D33] border border-white/10">
                  <Image
                    src={activity.imageSrc || "/teams/pfp.jpg"}
                    alt={activity.title}
                    fill
                    className="object-cover rounded-none grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>

                {/* Title & Badge Row */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans">
                    {activity.title}
                  </h3>
                  <span className="rounded-full bg-black/80 border border-white/20 px-3 py-1 text-[11px] font-semibold text-[#FF355E] tracking-wider whitespace-nowrap">
                    {activity.badge}
                  </span>
                </div>

                {/* Description Text with Uniform Length */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#8C93B0] font-sans">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
