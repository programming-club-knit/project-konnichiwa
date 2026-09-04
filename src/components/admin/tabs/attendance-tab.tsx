"use client";

import React, { useState, useEffect, Fragment } from 'react';
import {
  FiCalendar, FiCheck, FiX, FiSearch, FiSave,
  FiChevronDown, FiChevronRight, FiUsers, FiLoader,
} from 'react-icons/fi';
import { EventType } from '../types';
import { AdminPageHeader, AdminMetricCard, AdminEmptyState } from '../ui';

// Extended registration type to include all fields from old implementation
interface Attendee {
  _id: string;
  registrationId?: string;
  eventId?: string;
  name?: string;
  email?: string;
  rollNo?: string;
  contactNo?: string;
  gender?: string;
  type?: 'individual' | 'team';
  attended?: boolean;
  attendanceStatus?: 'present' | 'absent';
  leaderIndex?: number;
  team?: {
    teamName?: string;
    dynamic?: Record<string, any>;
  };
  participants?: Array<{
    name?: string;
    rollNo?: string;
    contactNo?: string;
    email?: string;
    gender?: string;
    dynamic?: Record<string, any>;
  }>;
  dynamic?: Record<string, any>;
  user?: { firstName: string; lastName: string };
  teamLeaderName?: string;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
}

interface AttendanceTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  // legacy registrations prop kept for compatibility but we re-fetch locally
  registrations?: any[];
}

export function AttendanceTab({
  events,
  selectedEventId,
  setSelectedEventId,
}: AttendanceTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [stats, setStats] = useState<AttendanceSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Re-fetch when event changes
  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
      fetchStats(selectedEventId);
    } else {
      setAttendees([]);
      setStats(null);
    }
    setExpandedRows(new Set());
    setSearchQuery('');
    setSaveMsg(null);
  }, [selectedEventId]);

  const fetchAttendees = async (eventId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/events/${eventId}/attendees`);
      const data = await res.json();
      const mapped: Attendee[] = (data.attendees || data.registrations || []).map((a: any) => ({
        ...a,
        attendanceStatus: a.attended ? 'present' : 'absent',
      }));
      setAttendees(mapped);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/attendance/summary`);
      const data = await res.json();
      if (data.summary) setStats(data.summary);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const toggleAttendance = (id: string) => {
    setAttendees(prev =>
      prev.map(a =>
        a._id === id
          ? { ...a, attendanceStatus: a.attendanceStatus === 'present' ? 'absent' : 'present' }
          : a
      )
    );
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      setSaveMsg(null);
      const updates = attendees.map(a => ({
        regId: a._id,
        attended: a.attendanceStatus === 'present',
      }));
      const res = await fetch(`/api/events/${selectedEventId}/attendance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setSaveMsg({ type: 'success', text: 'Attendance saved successfully.' });
      fetchStats(selectedEventId);
    } catch (err: any) {
      setSaveMsg({ type: 'error', text: err.message || 'Failed to save attendance.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getEventName = (eventId?: string) =>
    events.find(e => e._id === eventId)?.title || eventId || '';

  const formatRegId = (r: Attendee): string => {
    if (r.registrationId) return r.registrationId;
    const id = (r._id || '').slice(-6).toUpperCase();
    const title = getEventName(r.eventId);
    const code = (title || '')
      .split(/\s+/)
      .map(w => w[0])
      .filter(Boolean)
      .slice(0, 3)
      .join('')
      .toUpperCase() || 'EVT';
    return `${code}-${id}`;
  };

  const getLeader = (r: Attendee) => {
    if (r.type === 'team') {
      const idx = Number.isInteger(r.leaderIndex) ? r.leaderIndex! : 0;
      return Array.isArray(r.participants) && r.participants[idx] ? r.participants[idx] : null;
    }
    return { name: r.name, rollNo: r.rollNo, contactNo: r.contactNo, email: r.email, gender: r.gender };
  };

  const renderValue = (value: any) => {
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="text-slate-300 underline hover:text-white"
          onClick={e => e.stopPropagation()}
        >
          View File
        </a>
      );
    }
    return String(value);
  };

  const filteredAttendees = attendees.filter(a => {
    const q = searchQuery.toLowerCase();
    const name = (a.name || a.team?.teamName || a.teamLeaderName || '').toLowerCase();
    const email = (a.email || '').toLowerCase();
    const roll = (a.rollNo || '').toLowerCase();
    return name.includes(q) || email.includes(q) || roll.includes(q);
  });

  const localPresent = attendees.filter(a => a.attendanceStatus === 'present').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        title="Attendance Management"
        description="Mark and save attendance for each event participant."
        actions={
          <div className="relative min-w-[200px]">
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-white/30 font-sans appearance-none cursor-pointer"
            >
              <option value="">Select Event</option>
              {events.map(ev => (
                <option key={ev._id} value={ev._id}>{ev.title}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
          </div>
        }
      />

      {/* No event selected */}
      {!selectedEventId && (
        <AdminEmptyState
          icon={<FiCalendar className="size-5 text-slate-400" />}
          title="No Event Selected"
          description="Select an event from the dropdown above to view, mark and manage participant attendance rosters."
        />
      )}

      {/* Loading */}
      {selectedEventId && loading && (
        <div className="py-14 text-center border border-white/10 rounded-lg bg-[#121626] flex items-center justify-center gap-2 text-xs text-slate-400">
          <FiLoader className="size-4 animate-spin text-[#FF355E]" /> Loading attendees...
        </div>
      )}

      {/* Content */}
      {selectedEventId && !loading && (
        <div className="space-y-4">

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <AdminMetricCard
                title="Total Registered"
                value={stats.total}
                icon={<FiUsers className="size-4" />}
                badgeText="Roster"
                badgeVariant="default"
              />
              <AdminMetricCard
                title="Present"
                value={localPresent}
                icon={<FiCheck className="size-4" />}
                badgeText="Verified"
                badgeVariant="success"
              />
              <AdminMetricCard
                title="Absent"
                value={attendees.length - localPresent}
                icon={<FiX className="size-4" />}
                badgeText="Unverified"
                badgeVariant="danger"
              />
            </div>
          )}

          {/* Save Message */}
          {saveMsg && (
            <div className={`p-3 rounded-md text-xs font-medium border ${
              saveMsg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300'
                : 'bg-red-950/40 border-red-500/20 text-red-300'
            }`}>
              {saveMsg.text}
            </div>
          )}

          {/* Controls: Search + Save */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#121626] border border-white/10 rounded-lg px-4 py-3">
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email or roll no..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#090B14] border border-white/15 rounded-md text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
              />
            </div>
            <button
              onClick={saveAttendance}
              disabled={saving || attendees.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap"
            >
              {saving ? <FiLoader className="size-3.5 animate-spin" /> : <FiSave className="size-3.5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Attendees Table */}
          {filteredAttendees.length > 0 ? (
            <div className="w-full border border-white/10 rounded-lg bg-[#121626] overflow-hidden">
              <div className="max-h-[560px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="sticky top-0 bg-[#0D1020] z-10 border-b border-white/10">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Reg ID</th>
                      <th className="py-3 px-4">Name / Team</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4 text-center">Attendance</th>
                      <th className="py-3 px-4 text-center">Expand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs text-slate-300">
                    {filteredAttendees.map(attendee => {
                      const isExpanded = expandedRows.has(attendee._id);
                      const leader = getLeader(attendee);
                      const isTeam = attendee.type === 'team';
                      const isPresent = attendee.attendanceStatus === 'present';

                      return (
                        <Fragment key={attendee._id}>
                          <tr className="hover:bg-white/[0.025] transition-colors">
                            {/* Reg ID */}
                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[11px]">
                                {formatRegId(attendee)}
                              </span>
                            </td>
                            {/* Name */}
                            <td className="py-3.5 px-4">
                              <p className="text-white font-medium">
                                {isTeam ? (attendee.team?.teamName || attendee.name) : (attendee.name || attendee.teamLeaderName)}
                              </p>
                              <p className="text-slate-500 text-[11px] mt-0.5">{attendee.email}</p>
                            </td>
                            {/* Details */}
                            <td className="py-3.5 px-4 text-slate-400">
                              {leader ? (
                                <div className="space-y-0.5 text-[11px]">
                                  {isTeam && <div><span className="text-slate-500">Leader: </span>{leader.name}</div>}
                                  <div><span className="text-slate-500">Roll: </span>{leader.rollNo || '—'}</div>
                                  <div><span className="text-slate-500">Contact: </span>{leader.contactNo || '—'}</div>
                                </div>
                              ) : '—'}
                            </td>
                            {/* Toggle Button */}
                            <td className="py-3.5 px-4">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => toggleAttendance(attendee._id)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
                                    isPresent
                                      ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/80'
                                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-300'
                                  }`}
                                >
                                  {isPresent ? (
                                    <><FiCheck className="size-3.5" /> Present</>
                                  ) : (
                                    <><FiX className="size-3.5" /> Absent</>
                                  )}
                                </button>
                              </div>
                            </td>
                            {/* Expand */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => toggleRow(attendee._id)}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors inline-flex items-center justify-center"
                                title="View details"
                              >
                                {isExpanded
                                  ? <FiChevronDown className="size-4 text-slate-300" />
                                  : <FiChevronRight className="size-4 text-slate-500" />
                                }
                              </button>
                            </td>
                          </tr>

                          {/* Expanded detail row */}
                          {isExpanded && (
                            <tr className="bg-white/[0.02] border-b border-white/5">
                              <td colSpan={5} className="px-4 py-4">
                                <div className="bg-[#0D1020] border border-white/10 rounded-md p-4 space-y-4">
                                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Additional Information
                                  </h4>

                                  {isTeam ? (
                                    <>
                                      {/* Team dynamic fields */}
                                      {attendee.team?.dynamic && Object.keys(attendee.team.dynamic).length > 0 && (
                                        <div>
                                          <p className="text-[11px] text-slate-500 mb-2">Team Fields</p>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {Object.entries(attendee.team.dynamic).map(([k, v]) => (
                                              <div key={k} className="bg-[#090B14] border border-white/10 rounded-md p-2.5">
                                                <p className="text-[10px] text-slate-500 mb-1">{k}</p>
                                                <p className="text-xs text-white break-words">{renderValue(v)}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Participants */}
                                      {Array.isArray(attendee.participants) && attendee.participants.length > 0 && (
                                        <div>
                                          <p className="text-[11px] text-slate-500 mb-2">Participants</p>
                                          <div className="space-y-3">
                                            {attendee.participants.map((p, idx) => (
                                              <div key={idx} className="bg-[#090B14] border border-white/10 rounded-md p-3">
                                                <p className="text-xs text-white font-semibold mb-1.5">
                                                  {idx === (attendee.leaderIndex ?? 0) ? '★ Team Leader' : `Member ${idx + 1}`}: {p.name}
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-400">
                                                  {p.gender && <div><span className="text-slate-500">Gender: </span>{p.gender}</div>}
                                                  {p.rollNo && <div><span className="text-slate-500">Roll: </span>{p.rollNo}</div>}
                                                  {p.contactNo && <div><span className="text-slate-500">Contact: </span>{p.contactNo}</div>}
                                                  {p.email && <div><span className="text-slate-500">Email: </span>{p.email}</div>}
                                                </div>
                                                {p.dynamic && Object.keys(p.dynamic).length > 0 && (
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-[11px]">
                                                    {Object.entries(p.dynamic).map(([k, v]) => (
                                                      <div key={k} className="bg-white/5 border border-white/10 rounded p-1.5">
                                                        <span className="text-slate-500">{k}: </span>
                                                        <span className="text-white">{renderValue(v)}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    /* Individual dynamic fields */
                                    attendee.dynamic && Object.keys(attendee.dynamic).length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {Object.entries(attendee.dynamic).map(([k, v]) => (
                                          <div key={k} className="bg-[#090B14] border border-white/10 rounded-md p-2.5">
                                            <p className="text-[10px] text-slate-500 mb-1">{k}</p>
                                            <p className="text-xs text-white break-words">{renderValue(v)}</p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-slate-500 text-xs">No extra fields for this registration.</p>
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
            <div className="py-14 text-center border border-white/10 rounded-lg bg-[#121626] text-slate-400 text-xs">
              {searchQuery
                ? 'No attendees match your search.'
                : 'No registered participants found for this event.'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
