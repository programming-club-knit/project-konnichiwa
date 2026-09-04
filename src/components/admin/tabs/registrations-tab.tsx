"use client";

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { 
  FiSearch, 
  FiDownload, 
  FiLoader, 
  FiUsers, 
  FiChevronDown, 
  FiChevronRight, 
  FiTrash2, 
  FiRefreshCw, 
  FiCalendar, 
  FiExternalLink,
  FiUserCheck,
  FiUser
} from 'react-icons/fi';
import { EventType, RegistrationType } from '../types';
import { AdminPageHeader, AdminBadge } from '../ui';

interface RegistrationsTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  filteredRegistrations: RegistrationType[];
  registrationSearch: string;
  setRegistrationSearch: (query: string) => void;
  dataLoading: boolean;
  onExportCSV: () => void;
}

export function RegistrationsTab({
  events,
  selectedEventId,
  setSelectedEventId,
  filteredRegistrations: initialRegistrations,
  registrationSearch,
  setRegistrationSearch,
  dataLoading: parentLoading,
  onExportCSV,
}: RegistrationsTabProps) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Fetch registrations when event or trash mode changes
  const fetchRegistrations = async (eventId: string, isTrash: boolean) => {
    if (!eventId) {
      setRegistrations([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/registrations?eventId=${eventId}&deleted=${isTrash}`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
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

  // Selected event metadata
  const selectedEvent = useMemo(() => {
    return events.find(e => e._id === selectedEventId);
  }, [events, selectedEventId]);

  const isTeamEvent = (selectedEvent?.registrationType || 'individual') === 'team';

  // Toggle row accordion
  const toggleRow = (regId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(regId)) {
        next.delete(regId);
      } else {
        next.add(regId);
      }
      return next;
    });
  };

  // Move to trash
  const handleDeleteRegistration = async (regId: string, name: string) => {
    if (!window.confirm(`Move registration for "${name}" to trash?`)) return;
    try {
      const res = await fetch(`/api/registrations/${regId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchRegistrations(selectedEventId, showTrash);
      } else {
        alert(data.message || 'Failed to delete registration');
      }
    } catch (err) {
      console.error('Error deleting registration:', err);
    }
  };

  // Restore from trash
  const handleRestoreRegistration = async (regId: string, name: string) => {
    if (!window.confirm(`Restore registration for "${name}" from trash?`)) return;
    try {
      const res = await fetch(`/api/registrations/${regId}/restore`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        fetchRegistrations(selectedEventId, showTrash);
      } else {
        alert(data.message || 'Failed to restore registration');
      }
    } catch (err) {
      console.error('Error restoring registration:', err);
    }
  };

  // Filtered by local search query
  const displayedRegistrations = useMemo(() => {
    if (!registrationSearch.trim()) return registrations;
    const q = registrationSearch.toLowerCase();
    return registrations.filter(r => {
      const nameMatch = (r.name || r.team?.teamName || r.teamLeaderName || '').toLowerCase().includes(q);
      const emailMatch = (r.email || r.user?.email || '').toLowerCase().includes(q);
      const regIdMatch = (r.registrationId || r._id || '').toLowerCase().includes(q);
      const rollMatch = (r.rollNo || '').toLowerCase().includes(q);
      const participantsMatch = Array.isArray(r.participants) && r.participants.some((p: any) => 
        (p.name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q) || (p.rollNo || '').toLowerCase().includes(q)
      );
      return nameMatch || emailMatch || regIdMatch || rollMatch || participantsMatch;
    });
  }, [registrations, registrationSearch]);

  // Statistics calculation
  const stats = useMemo(() => {
    let totalRegs = registrations.length;
    let totalParticipants = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;

    registrations.forEach(r => {
      if (r.type === 'team' && Array.isArray(r.participants)) {
        totalParticipants += r.participants.length;
        r.participants.forEach((p: any) => {
          const g = (p.gender || '').toLowerCase();
          if (g === 'male' || g === 'm') maleCount++;
          else if (g === 'female' || g === 'f') femaleCount++;
          else otherCount++;
        });
      } else {
        totalParticipants += 1;
        const g = (r.gender || '').toLowerCase();
        if (g === 'male' || g === 'm') maleCount++;
        else if (g === 'female' || g === 'f') femaleCount++;
        else otherCount++;
      }
    });

    return { totalRegs, totalParticipants, maleCount, femaleCount, otherCount };
  }, [registrations]);

  // Format Registration ID tag
  const formatRegId = (r: any) => {
    if (r.registrationId) return r.registrationId;
    const id = (r._id || '').slice(-6).toUpperCase();
    const title = selectedEvent?.title || 'EVT';
    const code = title.split(/\s+/).map((w: string) => w[0]).filter(Boolean).slice(0, 3).join('').toUpperCase() || 'EVT';
    return `${code}-${id}`;
  };

  // Helper to render dynamic value or link
  const renderValue = (value: any) => {
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 inline-flex text-xs font-mono"
          onClick={e => e.stopPropagation()}
        >
          <span>View Upload</span>
          <FiExternalLink className="size-3" />
        </a>
      );
    }
    return String(value ?? '—');
  };

  // Export CSV function
  const handleExportCustomCSV = () => {
    if (!displayedRegistrations.length) return;
    const rows = displayedRegistrations.map(r => ({
      RegistrationID: formatRegId(r),
      Type: r.type || 'individual',
      NameOrTeam: r.name || r.team?.teamName || 'N/A',
      Email: r.email || r.participants?.[0]?.email || 'N/A',
      Contact: r.contactNo || r.mobile || r.participants?.[0]?.contactNo || 'N/A',
      RollNumber: r.rollNo || r.participants?.[0]?.rollNo || 'N/A',
      Gender: r.gender || r.participants?.[0]?.gender || 'N/A',
      Attended: r.attended ? 'Yes' : 'No',
      RegistrationDate: r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A',
    }));

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows.map(row => Object.values(row).map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `registrations_${selectedEvent?.slug || 'event'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCurrentLoading = loading || parentLoading;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        title="Event Registrations"
        description={
          selectedEvent ? (
            <span>Selected Event: <span className="text-white font-medium">{selectedEvent.title}</span></span>
          ) : (
            'Select an event to view, search, and manage registered participant rosters.'
          )
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Event Selector */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 pl-3 pr-9 text-xs text-white focus:outline-none focus:border-white/30 font-sans appearance-none cursor-pointer"
              >
                <option value="">Select Event</option>
                {events.map(ev => (
                  <option key={ev._id} value={ev._id}>{ev.title}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
            </div>

            {/* View Active vs View Trash toggle */}
            {selectedEventId && (
              <button
                onClick={() => setShowTrash(prev => !prev)}
                className={`px-3 py-2 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showTrash
                    ? 'bg-red-950/40 border-red-500/30 text-red-300'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <FiTrash2 className="size-3.5" />
                <span>{showTrash ? 'Viewing Trash' : 'View Trash'}</span>
              </button>
            )}

            {/* Export CSV */}
            <button
              onClick={handleExportCustomCSV}
              disabled={displayedRegistrations.length === 0}
              className="px-3.5 py-2 border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
            >
              <FiDownload className="size-3.5" /> Export CSV
            </button>

            {/* Refresh */}
            {selectedEventId && (
              <button
                onClick={() => fetchRegistrations(selectedEventId, showTrash)}
                disabled={isCurrentLoading}
                className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md transition-all shadow-sm"
                title="Refresh Roster"
              >
                <FiRefreshCw className={`size-3.5 ${isCurrentLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        }
      />

      {/* Real-time Registration Stats Section */}
      {selectedEventId && registrations.length > 0 && !isCurrentLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-white/10 bg-[#121626] space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Total Registrations
            </span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {stats.totalRegs}
            </span>
          </div>

          <div className="p-4 rounded-lg border border-white/10 bg-[#121626] space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Total Participants
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
              {stats.totalParticipants}
            </span>
          </div>

          <div className="p-4 rounded-lg border border-white/10 bg-[#121626] space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Male Candidates
            </span>
            <span className="text-2xl font-bold font-mono text-cyan-400 tracking-tight">
              {stats.maleCount}
            </span>
          </div>

          <div className="p-4 rounded-lg border border-white/10 bg-[#121626] space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Female Candidates
            </span>
            <span className="text-2xl font-bold font-mono text-pink-400 tracking-tight">
              {stats.femaleCount}
            </span>
          </div>
        </div>
      )}

      {/* Search Input Filter */}
      {selectedEventId && registrations.length > 0 && (
        <div className="relative max-w-sm">
          <FiSearch className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, roll no, or ID..."
            value={registrationSearch}
            onChange={e => setRegistrationSearch(e.target.value)}
            className="w-full bg-[#121626] border border-white/10 rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 font-sans"
          />
        </div>
      )}

      {/* Main Table / Empty State */}
      {isCurrentLoading ? (
        <div className="py-16 text-center text-slate-400 font-sans text-xs flex items-center justify-center gap-2 border border-white/10 rounded-lg bg-[#121626]">
          <FiLoader className="size-4 animate-spin text-white/60" /> Loading participant records...
        </div>
      ) : !selectedEventId ? (
        <div className="py-16 text-center border border-white/10 rounded-lg bg-[#121626] space-y-2">
          <FiCalendar className="size-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">Select an event to view registrations and participant rosters.</p>
        </div>
      ) : displayedRegistrations.length > 0 ? (
        <div className="w-full overflow-x-auto border border-white/10 rounded-lg bg-[#121626]">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">{isTeamEvent ? 'Team Name' : 'Participant Name'}</th>
                {isTeamEvent ? (
                  <th className="py-3 px-4">Leader Details</th>
                ) : (
                  <>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Contact</th>
                  </>
                )}
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-slate-300">
              {displayedRegistrations.map(r => {
                const isExpanded = expandedRows.has(r._id);
                const isTeam = r.type === 'team';
                const displayName = isTeam ? (r.team?.teamName || r.name) : r.name;
                const leader = isTeam
                  ? (Array.isArray(r.participants) ? r.participants[r.leaderIndex || 0] : null)
                  : { name: r.name, rollNo: r.rollNo, contactNo: r.contactNo, email: r.email, gender: r.gender };

                const colCount = isTeamEvent ? 5 : 7;

                return (
                  <Fragment key={r._id}>
                    <tr className="hover:bg-white/[0.025] transition-colors">
                      {/* Reg ID */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {formatRegId(r)}
                        </span>
                      </td>

                      {/* Name / Team */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {isTeam ? <FiUsers className="size-3" /> : <FiUser className="size-3" />}
                          </div>
                          <span className="font-semibold text-white text-xs">{displayName}</span>
                        </div>
                      </td>

                      {/* Team Leader or Individual Info */}
                      {isTeamEvent ? (
                        <td className="py-3.5 px-4">
                          {leader ? (
                            <div className="space-y-0.5 text-xs">
                              <div className="font-medium text-white">{leader.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {leader.rollNo ? `Roll: ${leader.rollNo} • ` : ''}{leader.contactNo || leader.email || '—'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                      ) : (
                        <>
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-xs capitalize">
                            {r.gender || '—'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300 text-xs">
                            {r.rollNo ? (
                              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{r.rollNo}</span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                            {r.contactNo || r.mobile || r.email || '—'}
                          </td>
                        </>
                      )}

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-xs whitespace-nowrap">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Toggle Row Accordion */}
                          <button
                            onClick={() => toggleRow(r._id)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
                            title="Toggle custom fields and roster details"
                          >
                            {isExpanded ? (
                              <FiChevronDown className="size-3.5 text-emerald-400" />
                            ) : (
                              <FiChevronRight className="size-3.5 text-slate-400" />
                            )}
                          </button>

                          {/* Trash or Restore */}
                          {showTrash ? (
                            <button
                              onClick={() => handleRestoreRegistration(r._id, displayName)}
                              className="p-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 transition-all"
                              title="Restore Registration"
                            >
                              <FiRefreshCw className="size-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteRegistration(r._id, displayName)}
                              className="p-1.5 rounded bg-white/5 hover:bg-red-950/40 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all"
                              title="Move to Trash"
                            >
                              <FiTrash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Accordion Row Details */}
                    {isExpanded && (
                      <tr className="bg-[#090B14]/70 border-b border-white/[0.08]">
                        <td colSpan={colCount} className="p-4">
                          <div className="space-y-4 rounded-lg p-4 border border-white/10 bg-[#121626]">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2">
                              Registration Details & Submitted Fields
                            </h4>

                            {/* Team Dynamic Fields + Members Roster */}
                            {isTeam ? (
                              <div className="space-y-4">
                                {r.team?.dynamic && Object.keys(r.team.dynamic).length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                      Team Custom Fields
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                      {Object.entries(r.team.dynamic).map(([key, val]) => (
                                        <div key={key} className="p-2.5 rounded bg-[#090B14] border border-white/10">
                                          <span className="text-[11px] text-slate-400 block">{key}</span>
                                          <span className="text-xs text-white font-medium break-words">{renderValue(val)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {Array.isArray(r.participants) && r.participants.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                      Team Members ({r.participants.length})
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {r.participants.map((p: any, idx: number) => {
                                        const isLead = idx === (r.leaderIndex || 0);
                                        return (
                                          <div key={idx} className="p-3 rounded-md bg-[#090B14] border border-white/10 space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                                                {isLead ? <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">Leader</span> : <span className="text-slate-500">#{idx + 1}</span>}
                                                {p.name}
                                              </span>
                                              <span className="text-[11px] text-slate-400 capitalize">{p.gender}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                                              <div>Roll: <span className="text-slate-300">{p.rollNo || '—'}</span></div>
                                              <div>Phone: <span className="text-slate-300">{p.contactNo || '—'}</span></div>
                                              <div className="col-span-2 truncate">Email: <span className="text-slate-300">{p.email || '—'}</span></div>
                                            </div>
                                            {p.dynamic && Object.keys(p.dynamic).length > 0 && (
                                              <div className="pt-2 border-t border-white/10 grid grid-cols-1 gap-1.5">
                                                {Object.entries(p.dynamic).map(([dk, dv]) => (
                                                  <div key={dk} className="text-[11px]">
                                                    <span className="text-slate-500">{dk}: </span>
                                                    <span className="text-white">{renderValue(dv)}</span>
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
                              </div>
                            ) : (
                              /* Individual Dynamic Fields */
                              <div>
                                {r.dynamic && Object.keys(r.dynamic).length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.entries(r.dynamic).map(([key, val]) => (
                                      <div key={key} className="p-2.5 rounded bg-[#090B14] border border-white/10">
                                        <span className="text-[11px] text-slate-400 block">{key}</span>
                                        <span className="text-xs text-white font-medium break-words">{renderValue(val)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500">No additional custom fields were submitted for this registration.</p>
                                )}
                              </div>
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
      ) : (
        <div className="py-16 text-center border border-white/10 rounded-lg bg-[#121626] text-slate-400 font-sans text-xs">
          {showTrash 
            ? 'No deleted registrations in trash for this event.' 
            : 'No active registrations found matching your filter criteria.'
          }
        </div>
      )}
    </div>
  );
}
