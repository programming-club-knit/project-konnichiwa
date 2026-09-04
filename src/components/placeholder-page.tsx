export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="relative min-h-[70vh] flex flex-1 items-center justify-center px-5 py-12 bg-[#0f0f0f] text-white">
      {/* Vertical Dashed Guidelines Overlay matching /people */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-12 grid grid-cols-5 border-x border-dashed border-white/5">
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
          <div className="border-r border-dashed border-white/5 h-full" />
        </div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
          {title}
        </h1>
        <p className="mt-3 text-sm font-mono uppercase tracking-widest text-[#8C93B0]">
          Coming Soon
        </p>
      </div>
    </div>
  );
}
