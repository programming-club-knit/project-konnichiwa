"use client";

import React from 'react';
import { EventType, RegistrationType } from '../types';

interface AttendanceTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  registrations: RegistrationType[];
}

export function AttendanceTab({
  events,
  selectedEventId,
  setSelectedEventId,
  registrations,
}: AttendanceTabProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Attendance Tracking</h1>
          <p className="text-xs text-white/50 mt-0.5">Mark participant attendance for live event check-ins.</p>
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
      </div>

      {registrations.length > 0 ? (
        <div className="border border-white/10 rounded-xl bg-[#0E101A] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40 bg-white/[0.02]">
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Reg ID</th>
                <th className="py-3 px-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-white/80">
              {registrations.map(r => (
                <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {r.teamLeaderName || (r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Participant')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                    {r.registrationId || r._id.slice(-6)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                      r.attended
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-white/50'
                    }`}>
                      <span className={`size-1.5 rounded-full ${r.attended ? 'bg-emerald-400' : 'bg-white/40'}`} />
                      {r.attended ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center border border-white/10 rounded-xl bg-[#0E101A] text-white/40 font-mono text-xs">
          Select an event to view attendance.
        </div>
      )}
    </div>
  );
}
