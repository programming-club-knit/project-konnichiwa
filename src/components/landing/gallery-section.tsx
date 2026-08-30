"use client";

import { Highlighter } from "@/components/ui/highlighter";

const GALLERY_IMAGES = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800",
    title: "Hackathon Night",
    desc: "Coding until dawn during our annual hackathon.",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800",
    title: "Bootcamp Sessions",
    desc: "Mentoring next-gen developers in full-stack engineering.",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    title: "CP Showdown",
    desc: "Intense competitive programming contests on campus.",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    title: "Community Meetups",
    desc: "Sharing tech trends and building open-source projects.",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="relative bg-transparent py-32 selection:bg-[#FF355E]/30 overflow-hidden">
      {/* Anime floating elements */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full bg-[#00F0FF]/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#FF355E]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-bold text-[#FF355E] uppercase tracking-widest mb-3">
            Moments in Time
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans">
            Our Club{" "}
            <Highlighter action="underline" color="#FF355E" strokeWidth={4}>
              <span className="text-white">Gallery</span>
            </Highlighter>
          </h2>
          <p className="mt-4 text-base text-[#8C93B0] max-w-xl mx-auto leading-relaxed">
            Snapshots of intense coding, team victories, and collaborative learning moments.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-[2rem] border-2 border-white/10 bg-[#140D26]/40 backdrop-blur-sm p-3 transition-all duration-500 hover:border-[#FF355E]/50 hover:-translate-y-2"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem]">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10" />
              </div>
              <div className="mt-4 px-2">
                <h3 className="text-lg font-black text-white group-hover:text-[#FF355E] transition-colors">
                  {img.title}
                </h3>
                <p className="text-xs text-[#A0A8C0] mt-1 font-medium leading-relaxed">
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
