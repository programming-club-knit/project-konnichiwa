import { connectDB } from "@/lib/mongodb";
import Event from "@/models/event";

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time?: string;
  status: string;
  completed?: boolean;
  venue?: string;
  eventType?: "offline" | "online";
  platform?: string;
  meetLink?: string;
  registrationDeadline?: string;
  coverImageUrl?: string;
  registrationType?: string;
  teamMinSize?: number;
  teamMaxSize?: number;
  googleFormLink?: string;
  ruleBookUrl?: string;
  whatsappGroupLink?: string;
  resources?: { label: string; url: string }[];
};

/** Fetch all events directly from MongoDB (server-side only). */
export async function getEvents(): Promise<EventItem[]> {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: -1 }).lean();
    // lean() returns plain objects; stringify/parse to strip Mongoose internals & convert ObjectId
    return JSON.parse(JSON.stringify(events)) as EventItem[];
  } catch (err) {
    console.error("getEvents error:", err);
    return [];
  }
}

/** Fetch a single event by slug directly from MongoDB (server-side only). */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event)) as EventItem;
  } catch (err) {
    console.error("getEventBySlug error:", err);
    return null;
  }
}
