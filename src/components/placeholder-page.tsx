export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-muted-foreground">
        {title} — coming soon
      </h1>
    </div>
  );
}
