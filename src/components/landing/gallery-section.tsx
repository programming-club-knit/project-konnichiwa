import { FiCamera, FiImage } from "react-icons/fi";
import { SectionHeader } from "./section-header";

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  alt: string;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "CodeStorm Overnight Hackathon",
    category: "Hackathons",
    date: "Annual Flagship",
    imageSrc: "/images/gallery-hackathon.jpg",
    alt: "CodeStorm Hackathon moments",
  },
  {
    id: "g2",
    title: "Weekly CP Contest & Editorial Session",
    category: "Contests",
    date: "Every Weekend",
    imageSrc: "/images/gallery-cp.jpg",
    alt: "Competitive programming contest",
  },
  {
    id: "g3",
    title: "Full-Stack Dev Bootcamp Sprint",
    category: "Workshops",
    date: "8-Week Track",
    imageSrc: "/images/gallery-bootcamp.jpg",
    alt: "Dev Bootcamp workshop",
  },
  {
    id: "g4",
    title: "Alumni Tech Talk & Speaker AMAs",
    category: "Talks",
    date: "Monthly",
    imageSrc: "/images/gallery-talks.jpg",
    alt: "Tech Talk presentation",
  },
  {
    id: "g5",
    title: "Open Source Contribution Day",
    category: "OSS",
    date: "Sprint Night",
    imageSrc: "/images/gallery-oss.jpg",
    alt: "Open Source Sprint",
  },
  {
    id: "g6",
    title: "PTSC Annual Community Meetup",
    category: "Community",
    date: "KNIT Campus",
    imageSrc: "/images/gallery-meetup.jpg",
    alt: "PTSC community gathering",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="relative bg-[#0B0D19] py-24">
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
        <SectionHeader
          eyebrow="Campus & Moments"
          title="Life at PTSC · Photo Gallery"
          desc="Moments from our hackathons, bootcamps, contest nights, and community meetups at KNIT Sultanpur."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="playgame-card group overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-1"
            >
              {/* Photo Placeholder Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#16192C] border border-white/10 flex flex-col items-center justify-center text-center p-6 group-hover:border-[#FF355E]/40 transition-colors">
                <div className="flex flex-col items-center justify-center gap-2 text-[#8C93B0] group-hover:text-white transition-colors">
                  <div className="grid size-12 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#FF355E]/10 group-hover:border-[#FF355E]/40 transition-colors">
                    <FiImage className="size-6 text-[#FF355E]" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide uppercase mt-1">
                    Photo Placeholder
                  </span>
                  <span className="text-[11px] font-mono text-[#8C93B0]">
                    {item.imageSrc}
                  </span>
                </div>

                <div className="absolute top-3 left-3 rounded-lg bg-[#FF355E] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  {item.category}
                </div>
              </div>

              <div className="mt-4 px-2 pb-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8C93B0]">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1">
                    <FiCamera className="size-3.5 text-[#FFB800]" /> PTSC Gallery
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-white tracking-tight group-hover:text-[#FF355E] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
