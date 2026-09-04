"use client";

import React, { useState, useEffect, useMemo, Fragment } from "react";
import { 
  FiSearch, 
  FiDownload, 
  FiLoader, 
  FiCalendar, 
  FiTrash2, 
  FiRefreshCw, 
  FiChevronDown, 
  FiChevronRight, 
  FiEdit2, 
  FiUsers, 
  FiUser, 
  FiExternalLink,
  FiRotateCcw,
  FiCheck
} from "react-icons/fi";
import { EventType } from "../types";
import { EditRegistrationModal } from "./edit-registration-modal";

interface RegistrationsTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  filteredRegistrations?: any[];
  registrationSearch?: string;
  setRegistrationSearch?: (query: string) => void;
  dataLoading?: boolean;
  onExportCSV?: () => void;
  adminUser?: any;
}

export function RegistrationsTab({
  events,
  selectedEventId,
  setSelectedEventId,
  adminUser,
}: RegistrationsTabProps) {
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingRegistration, setEditingRegistration] = useState<any | null>(null);

  const isAdmin = adminUser?.role === "admin" || adminUser?.role === "member";

  // Fetch registrations when event or trash mode changes
  const fetchRegistrations = async (eventId: string, inTrash: boolean) => {
    if (!eventId) {
      setRegistrations([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/registrations?eventId=${eventId}&deleted=${inTrash}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data?.registrations) ? data.registrations : []);
      }
    } catch (err) {
      console.error("Failed to load registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations(selectedEventId, showTrash);
    } else {
      setRegistrations([]);
    }
  }, [selectedEventId, showTrash]);

  const handleDeleteRegistration = async (regId: string) => {
    if (!window.confirm("Move this registration to trash?")) return;
    try {
      const res = await fetch(`/api/registrations/${regId}`, { method: "DELETE" });
      if (res.ok) {
        fetchRegistrations(selectedEventId, showTrash);
      }
    } catch (err) {
      console.error("Error trashing registration:", err);
    }
  };

  const handleRestoreRegistration = async (regId: string) => {
    try {
      const res = await fetch(`/api/registrations/${regId}/restore`, { method: "PATCH" });
      if (res.ok) {
        fetchRegistrations(selectedEventId, showTrash);
      }
    } catch (err) {
      console.error("Error restoring registration:", err);
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
        gender: r?.gender || "-",
      };
    }
    return {
      name: r?.name || (r?.user ? `${r.user.firstName} ${r.user.lastName}` : "-"),
      rollNo: r?.rollNo || "-",
      contactNo: r?.contactNo || r?.mobile || "-",
      email: r?.email || r?.user?.email || "-",
      gender: r?.gender || "-",
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

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    if (!searchQuery.trim()) return registrations;
    const q = searchQuery.toLowerCase();
    return registrations.filter((r) => {
      const teamName = (r.team?.teamName || r.teamName || "").toLowerCase();
      const leaderName = (r.teamLeaderName || r.name || r.user?.firstName || "").toLowerCase();
      const email = (r.email || r.user?.email || "").toLowerCase();
      const rollNo = String(r.rollNo || "").toLowerCase();
      const regId = formatRegId(r).toLowerCase();
      return (
        teamName.includes(q) ||
        leaderName.includes(q) ||
        email.includes(q) ||
        rollNo.includes(q) ||
        regId.includes(q)
      );
    });
  }, [registrations, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    let totalParticipants = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;

    registrations.forEach((r) => {
      if (r.type === "team" && Array.isArray(r.participants) && r.participants.length > 0) {
        totalParticipants += r.participants.length;
        r.participants.forEach((p: any) => {
          const g = (p.gender || "").toLowerCase();
          if (g === "male" || g === "m") maleCount++;
          else if (g === "female" || g === "f") femaleCount++;
          else otherCount++;
        });
      } else {
        totalParticipants += 1;
        const g = (r.gender || "").toLowerCase();
        if (g === "male" || g === "m") maleCount++;
        else if (g === "female" || g === "f") femaleCount++;
        else otherCount++;
      }
    });

    return {
      totalRegs: registrations.length,
      totalParticipants,
      maleCount,
      femaleCount,
      otherCount,
    };
  }, [registrations]);

  // Comprehensive Export to CSV (with Team Members & Dynamic Fields)
  const handleExportSpreadsheet = () => {
    if (!filteredRegistrations.length) return;

    const rows: Record<string, any>[] = [];

    filteredRegistrations.forEach((r) => {
      const regId = formatRegId(r);
      const isTeam = r.type === "team" || Boolean(r.teamName) || Boolean(r.team?.teamName);

      if (isTeam && Array.isArray(r.participants) && r.participants.length > 0) {
        const teamName = r.team?.teamName || r.teamName || r.name || "";
        const teamDyn = r.team?.dynamic || {};
        const leaderIdx = r.leaderIndex ?? 0;

        r.participants.forEach((p: any, idx: number) => {
          const rowData: Record<string, any> = {
            "Registration ID": regId,
            Type: "Team",
            "Team Name": teamName,
            "Participant Name": p.name || "",
            "Is Leader": idx === leaderIdx ? "Yes" : "No",
            Gender: p.gender || "",
            "Roll Number": p.rollNo || "",
            Branch: p.branch || "",
            Year: p.year || "",
            Contact: p.contactNo || "",
            Email: p.email || "",
            Event: selectedEvent?.title || "Event",
            "Submission Date": r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
          };

          // Append team dynamic
          Object.entries(teamDyn).forEach(([k, v]) => {
            rowData[`Team_${k}`] = v;
          });

          // Append participant dynamic
          if (p.dynamic) {
            Object.entries(p.dynamic).forEach(([k, v]) => {
              rowData[`Member_${k}`] = v;
            });
          }

          rows.push(rowData);
        });
      } else {
        const dyn = r.dynamic || {};
        const rowData: Record<string, any> = {
          "Registration ID": regId,
          Type: "Individual",
          "Team Name": "",
          "Participant Name": r.name || (r.user ? `${r.user.firstName} ${r.user.lastName}` : ""),
          "Is Leader": "",
          Gender: r.gender || "",
          "Roll Number": r.rollNo || "",
          Branch: r.branch || "",
          Year: r.year || "",
          Contact: r.contactNo || r.mobile || "",
          Email: r.email || r.user?.email || "",
          Event: selectedEvent?.title || "Event",
          "Submission Date": r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
        };

        Object.entries(dyn).forEach(([k, v]) => {
          rowData[`Field_${k}`] = v;
        });

        rows.push(rowData);
      }
    });

    // Generate CSV
    const allHeaders = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
    const csvLines = [
      allHeaders.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) =>
        allHeaders
          .map((h) => {
            const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : "";
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob(["\uFEFF" + csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `registrations_${selectedEvent?.title?.toLowerCase().replace(/\s+/g, "_") || "event"}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Event Select Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Event Registrations</h1>
            {selectedEventId && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 font-bold">
                {registrations.length} {showTrash ? "in trash" : "entries"}
              </span>
            )}
          </div>
          {selectedEvent ? (
            <p className="text-xs text-white/50 mt-1">
              Active directory: <span className="text-[#FF355E] font-semibold">{selectedEvent.title}</span>
            </p>
          ) : (
            <p className="text-xs text-white/50 mt-1">
              Select an event to view registered participants, download spreadsheets, and edit details.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Event Selector */}
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-[#0f0f0f] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF355E] font-sans transition-all min-w-[180px]"
          >
            <option value="">-- Select Event --</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          {/* Active vs Trash View Toggle */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowTrash(!showTrash)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border shadow-sm ${
                showTrash
                  ? "bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                  : "bg-[#141414] border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
              title="Toggle Trash view"
            >
              <FiTrash2 className="size-3.5" />
              <span>{showTrash ? "Viewing Trash" : "View Trash"}</span>
            </button>
          )}

          {/* Export to CSV/Excel */}
          <button
            type="button"
            onClick={handleExportSpreadsheet}
            disabled={!registrations.length}
            className="px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm"
            title="Download participant spreadsheet"
          >
            <FiDownload className="size-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => selectedEventId && fetchRegistrations(selectedEventId, showTrash)}
            disabled={loading || !selectedEventId}
            className="p-2 rounded-xl border border-white/10 bg-[#141414] text-white/70 hover:text-white hover:bg-white/5 transition-all"
            title="Refresh participant list"
          >
            <FiRefreshCw className={`size-4 ${loading ? "animate-spin text-[#FF355E]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      {selectedEventId && registrations.length > 0 && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-white/10 bg-[#141414] shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5">
              Total Registrations
            </span>
            <span className="text-xl font-bold text-white font-mono">{stats.totalRegs}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5">
              Total Participants
            </span>
            <span className="text-xl font-bold text-[#FF355E] font-mono">{stats.totalParticipants}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5">
              Male Entries
            </span>
            <span className="text-xl font-bold text-blue-400 font-mono">{stats.maleCount}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mb-0.5">
              Female Entries
            </span>
            <span className="text-xl font-bold text-pink-400 font-mono">{stats.femaleCount}</span>
          </div>
        </div>
      )}

      {/* Search Input Filter */}
      {selectedEventId && registrations.length > 0 && (
        <div className="relative">
          <FiSearch className="size-3.5 absolute left-3.5 top-3 text-white/40" />
          <input
            type="text"
            placeholder="Search by participant name, team name, email, roll number, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-white/10 bg-[#141414] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF355E] font-sans transition-all"
          />
        </div>
      )}

      {/* Content State: Loading, Empty, or Table */}
      {loading ? (
        <div className="py-20 text-center text-white/40 font-mono text-xs flex flex-col items-center justify-center gap-3 border border-white/10 rounded-2xl bg-[#141414]">
          <FiLoader className="size-6 animate-spin text-[#FF355E]" />
          <span>Loading registrations...</span>
        </div>
      ) : !selectedEventId ? (
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#141414] space-y-3">
          <FiCalendar className="size-12 text-white/20 mx-auto" />
          <p className="text-base font-bold text-white tracking-tight">No event selected</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-mono">
            Please choose an event from the dropdown above to view its registered participants.
          </p>
        </div>
      ) : filteredRegistrations.length > 0 ? (
        <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-wider text-white/60">
                  <th className="py-3 px-4">Reg ID</th>
                  <th className="py-3 px-4">Team / Name</th>
                  <th className="py-3 px-4">Leader / Details</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white/80">
                {filteredRegistrations.map((r) => {
                  const isExpanded = expandedRows.has(r._id);
                  const isTeam = r.type === "team" || Boolean(r.teamName) || Boolean(r.team?.teamName);
                  const leader = getLeader(r);

                  return (
                    <Fragment key={r._id}>
                      <tr className="hover:bg-white/[0.02] transition-colors group">
                        {/* Reg ID */}
                        <td className="py-3.5 px-4 font-mono text-xs text-white/70">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                            {formatRegId(r)}
                          </span>
                        </td>

                        {/* Team or Participant Name */}
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div className="flex items-center gap-1.5">
                            {isTeam ? (
                              <FiUsers className="size-3.5 text-blue-400 shrink-0" />
                            ) : (
                              <FiUser className="size-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span className="line-clamp-1">{isTeam ? r.team?.teamName || r.teamName || r.name : r.name}</span>
                          </div>
                        </td>

                        {/* Leader or Individual Details */}
                        <td className="py-3.5 px-4 text-white/70">
                          {isTeam ? (
                            <div className="space-y-0.5 text-xs">
                              <div>
                                <span className="text-white/40">Leader:</span> {leader.name}
                              </div>
                              <div className="flex flex-wrap gap-3 font-mono text-[11px] text-white/50">
                                <span>Roll: {leader.rollNo}</span>
                                <span>Contact: {leader.contactNo}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-3 font-mono text-[11px] text-white/60">
                              <span>Gender: {r.gender || "-"}</span>
                              <span>Roll: {r.rollNo || "-"}</span>
                              <span>Contact: {r.contactNo || r.mobile || "-"}</span>
                            </div>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Accordion expand button */}
                            <button
                              type="button"
                              onClick={() => toggleRow(r._id)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                              title="Toggle registration details"
                            >
                              {isExpanded ? (
                                <FiChevronDown className="size-4 text-[#FF355E]" />
                              ) : (
                                <FiChevronRight className="size-4" />
                              )}
                            </button>

                            {/* Edit Registration Button */}
                            {isAdmin && !showTrash && (
                              <button
                                type="button"
                                onClick={() => setEditingRegistration(r)}
                                className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                                title="Edit registration"
                              >
                                <FiEdit2 className="size-3.5" />
                              </button>
                            )}

                            {/* Trash / Restore Button */}
                            {isAdmin && (
                              showTrash ? (
                                <button
                                  type="button"
                                  onClick={() => handleRestoreRegistration(r._id)}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                                  title="Restore registration"
                                >
                                  <FiRotateCcw className="size-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRegistration(r._id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                  title="Move to trash"
                                >
                                  <FiTrash2 className="size-3.5" />
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Details Accordion */}
                      {isExpanded && (
                        <tr key={`${r._id}-expanded`} className="border-b border-white/5 bg-white/[0.02]">
                          <td colSpan={5} className="p-4">
                            <div className="p-4 rounded-xl border border-white/10 bg-[#0f0f0f] space-y-4">
                              <h4 className="text-xs font-mono uppercase tracking-wider text-[#FF355E] font-semibold flex items-center gap-1.5">
                                Additional Information &amp; Member Roster
                              </h4>

                              {isTeam ? (
                                <>
                                  {/* Team Dynamic Fields */}
                                  {r.team?.dynamic && Object.keys(r.team.dynamic).length > 0 && (
                                    <div className="space-y-1.5">
                                      <p className="text-[10px] font-mono uppercase text-white/40 font-semibold">
                                        Team Custom Answers:
                                      </p>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {Object.entries(r.team.dynamic).map(([k, v]) => (
                                          <div key={k} className="p-2 rounded-lg bg-[#141414] border border-white/5">
                                            <span className="text-[10px] font-mono text-white/50 block capitalize">{k}:</span>
                                            <span className="text-xs text-white break-words">{renderValue(v)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Participants List */}
                                  {Array.isArray(r.participants) && r.participants.length > 0 ? (
                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                      <p className="text-[10px] font-mono uppercase text-white/40 font-semibold">
                                        Team Members ({r.participants.length}):
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {r.participants.map((p: any, pIdx: number) => {
                                          const isLeader = pIdx === (r.leaderIndex ?? 0);
                                          return (
                                            <div
                                              key={pIdx}
                                              className={`p-3 rounded-xl border space-y-1.5 ${
                                                isLeader
                                                  ? "border-[#FF355E]/30 bg-[#FF355E]/5"
                                                  : "border-white/5 bg-[#141414]"
                                              }`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-white flex items-center gap-1">
                                                  {isLeader ? "👑 Leader:" : `Member #${pIdx + 1}:`} {p.name}
                                                </span>
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                                                  {p.gender || "N/A"}
                                                </span>
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
                                  ) : (
                                    <p className="text-xs text-white/40 font-mono">No participant roster recorded.</p>
                                  )}
                                </>
                              ) : (
                                /* Individual Dynamic Answers */
                                r.dynamic && Object.keys(r.dynamic).length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {Object.entries(r.dynamic).map(([k, v]) => (
                                      <div key={k} className="p-2 rounded-lg bg-[#141414] border border-white/5">
                                        <span className="text-[10px] font-mono text-white/50 block capitalize">{k}:</span>
                                        <span className="text-xs text-white break-words">{renderValue(v)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-white/40 font-mono">No custom dynamic fields recorded.</p>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#141414] space-y-3 font-sans">
          <FiCalendar className="size-12 text-white/20 mx-auto" />
          <p className="text-base font-bold text-white tracking-tight">No registrations found</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-mono">
            {searchQuery
              ? `No registrations matched "${searchQuery}". Try a different keyword or clear your search.`
              : showTrash
              ? "Trash is empty. No deleted registrations."
              : "No participants have registered for this event yet."}
          </p>
        </div>
      )}

      {/* Edit Registration Modal */}
      {editingRegistration && (
        <EditRegistrationModal
          registration={editingRegistration}
          event={selectedEvent}
          onClose={() => setEditingRegistration(null)}
          onSuccess={() => {
            setEditingRegistration(null);
            fetchRegistrations(selectedEventId, showTrash);
          }}
        />
      )}
    </div>
  );
}
