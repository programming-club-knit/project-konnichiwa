import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Highlighter } from "@/components/ui/highlighter";

export interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author?: string;
  published?: string;
  url: string;
  image: string;
  readTime?: string;
}

interface BlogSectionProps {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  posts?: Post[];
}

const DEFAULT_POSTS: Post[] = [
  {
    id: "cp-contests",
    title: "The Ultimate Guide to Competitive Programming in 2026",
    summary:
      "Since 2019, PTSC has built a strong competitive programming culture. Participation scaled rapidly, with teams qualifying for ICPC Regionals.",
    label: "PTSC Hustle",
    url: "#",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200", // Coding anime style
    author: "Ishaan Pandey",
    published: "Oct 24",
    readTime: "5 min read",
  },
  {
    id: "development",
    title: "Building Scalable Web Apps with Next.js",
    summary:
      "We host hands-on workshops across web, mobile, DevOps, machine learning, and open source, focused on real skills rather than slides.",
    label: "Development",
    url: "#",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800", // Tech setup
    author: "Ayush",
    published: "Oct 20",
    readTime: "7 min read",
  },
  {
    id: "hackathons",
    title: "Winning Smart India Hackathon: Our Strategy",
    summary:
      "PTSC organizes the internal Smart India Hackathon annually, with consistent national qualifications, finals, and wins.",
    label: "Hackathon",
    url: "#",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800", // Retro tech
    author: "PTSC Team",
    published: "Oct 15",
    readTime: "4 min read",
  },
  {
    id: "open-source",
    title: "Getting Started with GSoC and Open Source",
    summary:
      "Our open-source community has produced GSoC contributors, LFX scholars, and GitHub Externs across top global tech organizations.",
    label: "Open Source",
    url: "#",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=800", // Abstract tech
    author: "Community",
    published: "Oct 10",
    readTime: "6 min read",
  },
];

export function BlogSection({
  tagline = "Editorial",
  heading = "The PTSC Chronicles",
  description = "Dive into our latest articles, tutorials, and success stories from the community.",
  buttonText = "View All Articles",
  buttonUrl = "#",
  posts = DEFAULT_POSTS,
}: BlogSectionProps) {
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <section className="pt-32 pb-24 container mx-auto min-w-screen flex flex-col p-10 relative bg-[#090A14] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[5%] w-[40%] h-[30%] bg-[#F47174]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[30%] bg-[#8C52FF]/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-xs font-mono font-bold text-[#F47174] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#F47174]" />
              {tagline}
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-sans">
              {heading.split(" ").slice(0, -1).join(" ")}{" "}
              <Highlighter action="underline" color="#F47174" strokeWidth={4}>
                <span className="text-white">
                  {heading.split(" ").slice(-1)}
                </span>
              </Highlighter>
            </h2>
            <p className="mt-4 text-base text-[#8C93B0] font-sans leading-relaxed">
              {description}
            </p>
          </div>

          {buttonText && (
            <Link
              href={buttonUrl}
              target={buttonUrl.startsWith("http") ? "_blank" : undefined}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg hover:border-[#F47174]/50 hover:bg-[#F47174]/10 hover:text-[#F47174] transition-all duration-300"
            >
              {buttonText}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12 group relative rounded-[2rem] bg-[#140D26]/80 backdrop-blur-md border border-white/10 p-4 transition-all duration-500 hover:border-[#F47174]/40 hover:shadow-[0_10px_40px_rgba(244,113,116,0.15)] flex flex-col md:flex-row gap-8">
            <Link
              href={featuredPost.url}
              className="relative w-full md:w-1/2 aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden"
            >
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="rounded-full bg-[#F47174] px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_4px_10px_rgba(244,113,116,0.4)] border border-white/20 backdrop-blur-md">
                  {featuredPost.label}
                </span>
              </div>
            </Link>

            <div className="w-full md:w-1/2 flex flex-col justify-center pr-4 md:pr-8 py-4">
              <div className="flex items-center gap-3 text-xs font-mono text-[#8C93B0] mb-4">
                <span>{featuredPost.published}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" /> {featuredPost.readTime}
                </span>
              </div>
              <Link href={featuredPost.url}>
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#F47174] transition-colors">
                  {featuredPost.title}
                </h3>
              </Link>
              <p className="text-[#A0A8C0] text-base leading-relaxed mb-8">
                {featuredPost.summary}
              </p>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-[#F47174] to-[#8C52FF] p-0.5">
                    <div className="size-full rounded-full bg-[#140D26] flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {featuredPost.author?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {featuredPost.author}
                  </span>
                </div>
                <Link
                  href={featuredPost.url}
                  className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#F47174] transition-colors"
                >
                  Read Story <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="group relative rounded-[2rem] bg-[#140D26]/60 backdrop-blur-sm border border-white/10 p-3 transition-all duration-500 hover:border-[#8C52FF]/40 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(140,82,255,0.15)] flex flex-col"
            >
              <Link
                href={post.url}
                className="relative block aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                    {post.label}
                  </span>
                </div>
              </Link>

              <div className="flex flex-col flex-1 px-3 pb-3">
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#8C93B0] mb-3">
                  <span>{post.published}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight font-sans leading-snug mb-3 group-hover:text-[#8C52FF] transition-colors line-clamp-2">
                  <Link href={post.url}>{post.title}</Link>
                </h3>

                <p className="text-sm leading-relaxed text-[#8C93B0] font-sans line-clamp-3 mb-6">
                  {post.summary}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-bold text-white/70">
                    By {post.author}
                  </span>
                  <Link
                    href={post.url}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#8C52FF] hover:text-[#F47174] transition-colors"
                  >
                    Read more
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
