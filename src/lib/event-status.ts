export type EventDynamicStatus = "upcoming" | "live" | "past";

export interface EventTimingInfo {
  status: EventDynamicStatus;
  label: string;
  badgeClass: string;
  dotClass?: string;
  isLive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  startTime?: Date;
  endTime?: Date;
}

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

/**
 * Automatically determine whether an event is "live", "upcoming", or "past" (concluded)
 * based on its calendar date, schedule time range, and explicit completion flags.
 * This is client-safe with zero Node/Mongoose dependencies.
 */
export function getEventDynamicStatus(
  event: Partial<EventItem> | null | undefined,
  now: Date = new Date()
): EventTimingInfo {
  const statusLower = (event?.status || "").trim().toLowerCase();

  // If marked explicitly completed, past, or cancelled
  if (Boolean(event?.completed) || statusLower === "completed" || statusLower === "past") {
    return {
      status: "past",
      label: "Concluded",
      badgeClass: "bg-slate-900/90 border border-white/20 text-slate-300",
      isLive: false,
      isUpcoming: false,
      isPast: true,
    };
  }

  if (statusLower === "cancelled") {
    return {
      status: "past",
      label: "Cancelled",
      badgeClass: "bg-red-950/60 border border-red-500/30 text-red-400",
      isLive: false,
      isUpcoming: false,
      isPast: true,
    };
  }

  // Without a date, fallback to manual status
  if (!event || !event.date) {
    const isLiveManual = statusLower === "live" || statusLower === "ongoing";
    return {
      status: isLiveManual ? "live" : "upcoming",
      label: isLiveManual ? "Live Now" : "Upcoming",
      badgeClass: isLiveManual
        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
        : "bg-[#FF355E] border border-transparent text-white shadow-[0_4px_12px_rgba(255,53,94,0.3)]",
      dotClass: isLiveManual ? "bg-emerald-400 animate-ping" : undefined,
      isLive: isLiveManual,
      isUpcoming: !isLiveManual,
      isPast: false,
    };
  }

  const rawDate = new Date(event.date);
  if (isNaN(rawDate.getTime())) {
    const isLiveManual = statusLower === "live" || statusLower === "ongoing";
    return {
      status: isLiveManual ? "live" : "upcoming",
      label: isLiveManual ? "Live Now" : "Upcoming",
      badgeClass: isLiveManual
        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
        : "bg-[#FF355E] border border-transparent text-white",
      dotClass: isLiveManual ? "bg-emerald-400 animate-ping" : undefined,
      isLive: isLiveManual,
      isUpcoming: !isLiveManual,
      isPast: false,
    };
  }

  let year = rawDate.getFullYear();
  let month = rawDate.getMonth();
  let day = rawDate.getDate();

  // Prefer exact calendar date numbers if formatted as YYYY-MM-DD
  if (typeof event.date === "string") {
    const match = event.date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10) - 1;
      day = parseInt(match[3], 10);
    }
  }

  let startTime = new Date(year, month, day, 0, 0, 0, 0);
  let endTime = new Date(year, month, day, 23, 59, 59, 999);

  if (event.time && typeof event.time === "string") {
    const timeStr = event.time.trim();
    // Match time ranges: e.g. "10:00 AM - 1:00 PM", "10 AM to 5 PM", "14:00 - 18:00"
    const timeRangeMatch = timeStr.match(
      /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i
    );
    // Match single time: e.g. "5:00 PM IST", "14:30", "10:00 AM"
    const singleTimeMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);

    if (timeRangeMatch) {
      const [ , sH, sM, sMeridiemRaw, eH, eM, eMeridiemRaw ] = timeRangeMatch;
      let startH = parseInt(sH, 10);
      const startMin = sM ? parseInt(sM, 10) : 0;
      let endH = parseInt(eH, 10);
      const endMin = eM ? parseInt(eM, 10) : 0;

      let sMeridiem = sMeridiemRaw?.toLowerCase();
      const eMeridiem = eMeridiemRaw?.toLowerCase();

      // If start omitted meridiem but end has one (e.g. 2 - 5 PM)
      if (!sMeridiem && eMeridiem) {
        sMeridiem = startH < endH && eMeridiem === "pm" ? "pm" : (startH === 12 ? "pm" : "am");
      }

      if (sMeridiem === "pm" && startH < 12) startH += 12;
      if (sMeridiem === "am" && startH === 12) startH = 0;

      if (eMeridiem === "pm" && endH < 12) endH += 12;
      if (eMeridiem === "am" && endH === 12) endH = 0;

      startTime = new Date(year, month, day, startH, startMin, 0, 0);
      endTime = new Date(year, month, day, endH, endMin, 0, 0);

      // If end time is before start time (spans overnight), add 1 day to end time
      if (endTime <= startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }
    } else if (singleTimeMatch) {
      const [ , sH, sM, sMeridiemRaw ] = singleTimeMatch;
      let startH = parseInt(sH, 10);
      const startMin = sM ? parseInt(sM, 10) : 0;
      const sMeridiem = sMeridiemRaw?.toLowerCase();

      if (sMeridiem === "pm" && startH < 12) startH += 12;
      if (sMeridiem === "am" && startH === 12) startH = 0;

      startTime = new Date(year, month, day, startH, startMin, 0, 0);
      // Default event duration: 3 hours or end of day
      const threeHoursLater = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
      const endOfDay = new Date(year, month, day, 23, 59, 59, 999);
      endTime = threeHoursLater > endOfDay ? threeHoursLater : endOfDay;
    }
  }

  const nowMs = now.getTime();

  if (nowMs > endTime.getTime()) {
    return {
      status: "past",
      label: "Concluded",
      badgeClass: "bg-slate-900/90 border border-white/20 text-slate-300",
      isLive: false,
      isUpcoming: false,
      isPast: true,
      startTime,
      endTime,
    };
  }

  if (nowMs >= startTime.getTime() && nowMs <= endTime.getTime()) {
    return {
      status: "live",
      label: "Live Now",
      badgeClass: "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      dotClass: "bg-emerald-400 animate-ping",
      isLive: true,
      isUpcoming: false,
      isPast: false,
      startTime,
      endTime,
    };
  }

  return {
    status: "upcoming",
    label: "Upcoming",
    badgeClass: "bg-[#FF355E] border border-transparent text-white shadow-[0_4px_12px_rgba(255,53,94,0.3)]",
    isLive: false,
    isUpcoming: true,
    isPast: false,
    startTime,
    endTime,
  };
}

/** Returns just the dynamic status string: "upcoming" | "live" | "past" */
export function getEventStatus(
  event: Partial<EventItem> | null | undefined,
  now: Date = new Date()
): EventDynamicStatus {
  return getEventDynamicStatus(event, now).status;
}
