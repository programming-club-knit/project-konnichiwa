"use client";

import React, { useState, useEffect, useMemo, Fragment } from "react";
import { 
  FiCalendar, 
  FiCheck, 
  FiX, 
  FiSearch, 
  FiSave, 
  FiChevronDown, 
  FiChevronRight, 
  FiLoader, 
  FiUsers, 
  FiUser, 
  FiExternalLink,
  FiRefreshCw
} from "react-icons/fi";
import { EventType } from "../types";

interface AttendanceTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  registrations?: any[];
}

export function AttendanceTab({
  events,
  selectedEventId,
  setSelectedEventId,
}: AttendanceTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<{ total: number; present: number; absent: number } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
      fetchStats(selectedEventId);
    } else {
      setAttendees([]);
      setStats(null);
    }
  }, [selectedEventId]);

  const fetchAttendees = async (eventId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${eventId}/attendees`);
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.attendees || []).map((a: any) => ({
          ...a,
          attendanceStatus: a.attended ? "present" : "absent",
        }));
        setAttendees(mapped);
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/attendance/summary`);
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setStats(data.summary);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
    }
  };

  const toggleAttendance = (regId: string) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a._id === regId
          ? { ...a, attendanceStatus: a.attendanceStatus === "present" ? "absent" : "present" }
          : a
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedEventId || attendees.length === 0) return;
    try {
      setSaving(true);
      setSaveSuccess(false);
      const updates = attendees.map((a) => ({
        regId: a._id,
        attended: a.attendanceStatus === "present",
      }));

      const res = await fetch(`/api/events/${selectedEventId}/attendance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        fetchStats(selectedEventId);
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedEvent = useMemo(() => {
    return events.find((e) => e._id === selectedEventId);
  }, [events, selectedEventId]);

  const getEventName = (eventId?: string) => {
    const ev = events.find((e) => e._id === eventId);
    return ev?.title || ev?.name || "Event";
  };

  const formatRegId = (r: any) => {
    if (r?.registrationId) return r.registrationId;
    const id = (r?._id || "").slice(-6).toUpperCase();
    const title = getEventName(r?.eventId);
    const code =
      title
        .split(/\s+/)
        .map((w: string) => w[0])
        .filter(Boolean)
        .slice(0, 3)
        .join("")
        .toUpperCase() || "EVT";
    return `${code}-${id}`;
  };

  const getLeader = (r: any) => {
    if (r?.type === "team" || Boolean(r?.teamName) || Boolean(r?.team?.teamName)) {
      const idx = Number.isInteger(r?.leaderIndex) ? r.leaderIndex : 0;
      if (Array.isArray(r?.participants) && r.participants[idx]) {
        return r.participants[idx];
      }
      return {
        name: r?.teamLeaderName || r?.name || "-",
        rollNo: r?.rollNo || "-",
        contactNo: r?.contactNo || r?.mobile || "-",
        email: r?.email || "-",
      };
    }
    return {
      name: r?.name || (r?.user ? `${r.user.firstName} ${r.user.lastName}` : "-"),
      rollNo: r?.rollNo || "-",
      contactNo: r?.contactNo || r?.mobile || "-",
      email: r?.email || r?.user?.email || "-",
    };
  };

  const renderValue = (value: any) => {
    if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF355E] hover:underline inline-flex items-center gap-1 font-mono text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <FiExternalLink className="size-3" /> View File
        </a>
      );
    }
    return String(value ?? "");
  };

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return attendees;
    const q = searchQuery.toLowerCase();
    return attendees.filter((a) => {
      const name = (a.team?.teamName || a.teamName || a.name || "").toLowerCase();
      const email = (a.email || a.user?.email || "").toLowerCase();
      const rollNo = String(a.rollNo || "").toLowerCase();
      const regId = formatRegId(a).toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        rollNo.includes(q) ||
        regId.includes(q)
      );
    });
  }, [attendees, searchQuery]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Event Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Attendance Tracking</h1>
            {selectedEventId && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 font-bold">
                {attendees.length} check-ins
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1">
            Track and mark live attendee presence for certificate eligibility and event participation verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-[#0f0f0f] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF355E] font-sans transition-all min-w-[200px]"
          >
            <option value="">-- Select Event --</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => selectedEventId && fetchAttendees(selectedEventId)}
            disabled={loading || !selectedEventId}
            className="p-2 rounded-xl border border-white/10 bg-[#141414] text-white/70 hover:text-white hover:bg-white/5 transition-all"
            title="Refresh attendees"
          >
            <FiRefreshCw className={`size-4 ${loading ? "animate-spin text-[#FF355E]" : ""}`} />
          </button>
        </div>
      </div>

      {!selectedEventId ? (
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#141414] space-y-3 font-sans">
          <FiCalendar className="size-12 text-white/20 mx-auto" />
          <p className="text-base font-bold text-white tracking-tight">No event selected</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-mono">
            Select an event from the dropdown above to manage attendance check-ins.
          </p>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-white/40 font-mono text-xs flex flex-col items-center justify-center gap-3 border border-white/10 rounded-2xl bg-[#141414]">
          <FiLoader className="size-6 animate-spin text-[#FF355E]" />
          <span>Loading attendees directory...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Summary Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-white/10 bg-[#141414] flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-mono uppercase text-white/50 mb-0.5">Total Registered</p>
                  <p className="text-2xl font-bold text-white font-mono">{stats.total}</p>
                </div>
                <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                  <FiUsers className="size-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-mono uppercase text-emerald-400/70 mb-0.5">Present</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{stats.present}</p>
                </div>
                <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FiCheck className="size-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-mono uppercase text-red-400/70 mb-0.5">Absent</p>
                  <p className="text-2xl font-bold text-red-400 font-mono">{stats.absent}</p>
                </div>
                <div className="size-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <FiX className="size-5" />
                </div>
              </div>
            </div>
          )}

          {/* Search Bar & Save Changes Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center p-4 rounded-2xl border border-white/10 bg-[#141414] shadow-sm">
            <div className="relative w-full sm:w-72">
              <FiSearch className="size-3.5 absolute left-3.5 top-3 text-white/40" />
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-white/10 bg-[#0f0f0f] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF355E] font-sans"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {saveSuccess && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <FiCheck className="size-3.5" /> Saved successfully
                </span>
              )}

              <button
                type="button"
                onClick={saveAttendance}
                disabled={saving || attendees.length === 0}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shrink-0"
              >
                {saving ? (
                  <>
                    <FiLoader className="size-3.5 animate-spin text-black" /> Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="size-3.5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-wider text-white/60">
                    <th className="py-3 px-4">Reg ID</th>
                    <th className="py-3 px-4">Name / Team</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-white/80">
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee) => {
                      const isExpanded = expandedRows.has(attendee._id);
                      const isTeam = attendee.type === "team" || Boolean(attendee.teamName) || Boolean(attendee.team?.teamName);
                      const leader = getLeader(attendee);
                      const isPresent = attendee.attendanceStatus === "present";

                      return (
                        <Fragment key={attendee._id}>
                          <tr className="hover:bg-white/[0.02] transition-colors">
                            {/* Reg ID */}
                            <td className="py-3.5 px-4 font-mono text-xs text-white/70">
                              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                {formatRegId(attendee)}
                              </span>
                            </td>

                            {/* Name / Team */}
                            <td className="py-3.5 px-4 font-medium text-white">
                              <div className="flex items-center gap-1.5">
                                {isTeam ? (
                                  <FiUsers className="size-3.5 text-blue-400 shrink-0" />
                                ) : (
                                  <FiUser className="size-3.5 text-emerald-400 shrink-0" />
                                )}
                                <span className="line-clamp-1">{isTeam ? attendee.team?.teamName || attendee.teamName || attendee.name : attendee.name}</span>
                              </div>
                              <p className="text-[11px] text-white/40 font-mono mt-0.5 truncate">{attendee.email || "-"}</p>
                            </td>

                            {/* Details */}
                            <td className="py-3.5 px-4 text-white/70">
                              {leader ? (
                                <div className="space-y-0.5 text-xs">
                                  {isTeam && (
                                    <div>
                                      <span className="text-white/40">Leader:</span> {leader.name}
                                    </div>
                                  )}
                                  <div className="flex flex-wrap gap-3 font-mono text-[11px] text-white/50">
                                    <span>Roll: {leader.rollNo || "-"}</span>
                                    <span>Contact: {leader.contactNo || "-"}</span>
                                  </div>
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Interactive Status Toggle */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => toggleAttendance(attendee._id)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm ${
                                  isPresent
                                    ? "bg-emerald-500 text-black shadow-emerald-500/20 font-bold"
                                    : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {isPresent ? (
                                  <>
                                    <FiCheck className="size-3.5" /> Present
                                  </>
                                ) : (
                                  <>
                                    <FiX className="size-3.5" /> Absent
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Expand Row Details */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => toggleRow(attendee._id)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                                title="View details"
                              >
                                {isExpanded ? (
                                  <FiChevronDown className="size-4 text-[#FF355E]" />
                                ) : (
                                  <FiChevronRight className="size-4" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <tr key={`${attendee._id}-expanded`} className="border-b border-white/5 bg-white/[0.02]">
                              <td colSpan={5} className="p-4">
                                <div className="p-4 rounded-xl border border-white/10 bg-[#0f0f0f] space-y-4">
                                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#FF355E] font-semibold">
                                    Additional Information &amp; Member Roster
                                  </h4>

                                  {isTeam ? (
                                    <>
                                      {/* Team Dynamic */}
                                      {attendee.team?.dynamic && Object.keys(attendee.team.dynamic).length > 0 && (
                                        <div className="space-y-1.5">
                                          <p className="text-[10px] font-mono uppercase text-white/40">Team Answers:</p>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {Object.entries(attendee.team.dynamic).map(([k, v]) => (
                                              <div key={k} className="p-2 rounded-lg bg-[#141414] border border-white/5">
                                                <span className="text-[10px] font-mono text-white/50 block capitalize">{k}:</span>
                                                <span className="text-xs text-white break-words">{renderValue(v)}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Participants list */}
                                      {Array.isArray(attendee.participants) && attendee.participants.length > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-white/5">
                                          <p className="text-[10px] font-mono uppercase text-white/40">Participants ({attendee.participants.length}):</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {attendee.participants.map((p: any, idx: number) => {
                                              const isLeader = idx === (attendee.leaderIndex ?? 0);
                                              return (
                                                <div
                                                  key={idx}
                                                  className={`p-3 rounded-xl border space-y-1.5 ${
                                                    isLeader ? "border-[#FF355E]/30 bg-[#FF355E]/5" : "border-white/5 bg-[#141414]"
                                                  }`}
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-white">
                                                      {isLeader ? "👑 Leader:" : `Member #${idx + 1}:`} {p.name}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-white/50">{p.gender || "-"}</span>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/60">
                                                    <div>Roll: {p.rollNo || "-"}</div>
                                                    <div>Phone: {p.contactNo || "-"}</div>
                                                    <div className="col-span-2 truncate">Email: {p.email || "-"}</div>
                                                  </div>
                                                  {p.dynamic && Object.keys(p.dynamic).length > 0 && (
                                                    <div className="pt-1.5 border-t border-white/5 grid grid-cols-2 gap-1.5">
                                                      {Object.entries(p.dynamic).map(([k, v]) => (
                                                        <div key={k} className="text-[11px]">
                                                          <span className="text-white/40 mr-1 capitalize">{k}:</span>
                                                          <span className="text-white">{renderValue(v)}</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    attendee.dynamic && Object.keys(attendee.dynamic).length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {Object.entries(attendee.dynamic).map(([k, v]) => (
                                          <div key={k} className="p-2 rounded-lg bg-[#141414] border border-white/5">
                                            <span className="text-[10px] font-mono text-white/50 block capitalize">{k}:</span>
                                            <span className="text-xs text-white break-words">{renderValue(v)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-white/40 font-mono">No extra custom fields recorded.</p>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-white/40 font-mono text-xs">
                        No attendees found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
