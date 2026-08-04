"use client";

import React from 'react';
import { FiSearch, FiDownload, FiLoader } from 'react-icons/fi';
import { EventType, RegistrationType } from '../types';

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
  filteredRegistrations,
  registrationSearch,
  setRegistrationSearch,
  dataLoading,
  onExportCSV,
}: RegistrationsTabProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Event Registrations</h1>
          <p className="text-xs text-white/50 mt-0.5">Filter, search and export participant registrations.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="size-3.5 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search registrations..."
              value={registrationSearch}
              onChange={e => setRegistrationSearch(e.target.value)}
              className="bg-[#0E101A] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 font-mono w-48 sm:w-56"
            />
          </div>

          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="bg-[#0E101A] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
          >
            <option value="">Select Event</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>

          <button
            onClick={onExportCSV}
            disabled={filteredRegistrations.length === 0}
            className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
          >
            <FiDownload className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {dataLoading ? (
        <div className="py-16 text-center text-white/40 font-mono text-xs flex items-center justify-center gap-2 border border-white/10 rounded-xl bg-[#0E101A]">
          <FiLoader className="size-4 animate-spin text-white/60" /> Loading registration entries...
        </div>
      ) : filteredRegistrations.length > 0 ? (
        <div className="border border-white/10 rounded-xl bg-[#0E101A] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40 bg-white/[0.02]">
                <th className="py-3 px-4">Reg ID / Team</th>
                <th className="py-3 px-4">Name / Leader</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-white/80">
              {filteredRegistrations.map(r => (
                <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-white/60">
                    {r.registrationId || r.teamName || r._id.slice(-6)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {r.teamLeaderName || (r.user ? `${r.user.firstName} ${r.user.lastName}` : 'N/A')}
                  </td>
                  <td className="py-3.5 px-4 text-white/80">{r.email || r.user?.email || 'N/A'}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">{r.mobile || r.user?.mobile || 'N/A'}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center border border-white/10 rounded-xl bg-[#0E101A] text-white/40 font-mono text-xs">
          {selectedEventId ? 'No registrations found for this event.' : 'Select an event to view registrations.'}
        </div>
      )}
    </div>
  );
}
