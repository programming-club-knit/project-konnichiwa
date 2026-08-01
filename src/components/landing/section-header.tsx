type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  desc: string;
};

export function SectionHeader({ eyebrow, title, desc }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFB800]">
        <span className="h-0.5 w-6 bg-[#FFB800]" />
        {eyebrow}
      </div>
      <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base text-[#8C93B0] leading-relaxed">{desc}</p>
    </div>
  );
}