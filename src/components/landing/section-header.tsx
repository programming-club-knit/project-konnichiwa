type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  desc: string;
};

export function SectionHeader({ eyebrow, title, desc }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-2">
        <span className="h-px w-6 bg-brand-2/50" />
        {eyebrow}
      </div>
      <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground">{desc}</p>
    </div>
  );
}