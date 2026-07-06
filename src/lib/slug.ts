import Event from "@/models/event";

export function slugify(str: string): string {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function ensureUniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  if (!base) base = "event";
  let candidate = base;
  let counter = 2;
  while (
    await Event.exists(
      excludeId
        ? { slug: candidate, _id: { $ne: excludeId } }
        : { slug: candidate }
    )
  ) {
    candidate = `${base}-${counter}`;
    counter++;
    if (counter > 5000) {
      candidate = `${base}-${Date.now()}`;
      break;
    }
  }
  return candidate;
}
