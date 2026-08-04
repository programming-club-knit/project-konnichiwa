"use client";

import React from 'react';
import { FiSearch, FiPlus, FiLoader, FiCalendar } from 'react-icons/fi';
import { EventType } from '../types';
import { EventForm } from './event-form';

interface EventsTabProps {
  eventFormMode: 'list' | 'create' | 'edit';
  setEventFormMode: (mode: 'list' | 'create' | 'edit') => void;
  filteredEvents: EventType[];
  eventSearch: string;
  setEventSearch: (query: string) => void;
  dataLoading: boolean;
  onEditClick: (event: EventType) => void;
  onCreateClick: () => void;
  onDeleteClick: (eventId: string) => void;
  eventForm: any;
  setEventForm: React.Dispatch<React.SetStateAction<any>>;
  registrationFields: any[];
  setRegistrationFields: React.Dispatch<React.SetStateAction<any[]>>;
  participantFields: any[];
  setParticipantFields: React.Dispatch<React.SetStateAction<any[]>>;
  resources: { label: string; url: string }[];
  setResources: React.Dispatch<React.SetStateAction<{ label: string; url: string }[]>>;
  onFormSubmit: (e: React.FormEvent) => void;
}

export function EventsTab({
  eventFormMode,
  setEventFormMode,
  filteredEvents,
  eventSearch,
  setEventSearch,
  dataLoading,
  onEditClick,
  onCreateClick,
  onDeleteClick,
  eventForm,
  setEventForm,
  registrationFields,
  setRegistrationFields,
  participantFields,
  setParticipantFields,
  resources,
  setResources,
  onFormSubmit,
}: EventsTabProps) {
  if (eventFormMode !== 'list') {
    return (
      <EventForm
        eventFormMode={eventFormMode}
        eventForm={eventForm}
        setEventForm={setEventForm}
        registrationFields={registrationFields}
        setRegistrationFields={setRegistrationFields}
        participantFields={participantFields}
        setParticipantFields={setParticipantFields}
        resources={resources}
        setResources={setResources}
        dataLoading={dataLoading}
        onCancel={() => setEventFormMode('list')}
        onSubmit={onFormSubmit}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Events Management</h1>
          <p className="text-xs text-white/50 mt-0.5">Create, update or remove club events.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="size-3.5 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search events..."
              value={eventSearch}
              onChange={e => setEventSearch(e.target.value)}
              className="bg-[#0E101A] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 font-mono w-48 sm:w-60"
            />
          </div>

          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-white text-black hover:bg-white/90 text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <FiPlus className="size-3.5" /> New Event
          </button>
        </div>
      </div>

      {/* Events Table */}
      {dataLoading ? (
        <div className="py-16 text-center text-white/40 font-mono text-xs flex items-center justify-center gap-2 border border-white/10 rounded-xl bg-[#0E101A]">
          <FiLoader className="size-4 animate-spin text-white/60" /> Loading events directory...
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="border border-white/10 rounded-xl bg-[#0E101A] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40 bg-white/[0.02]">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-white/80">
              {filteredEvents.map(e => {
                const isUpcoming = e.status === 'upcoming';
                const isOngoing = e.status === 'ongoing';
                return (
                  <tr key={e._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white">{e.title}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                      {e.date ? new Date(e.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-white/50 uppercase">
                      {e.registrationType || 'individual'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        isUpcoming 
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' 
                          : isOngoing 
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' 
                          : 'border-white/10 bg-white/5 text-white/50'
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          isUpcoming ? 'bg-emerald-400' : isOngoing ? 'bg-amber-400' : 'bg-white/40'
                        }`} />
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onEditClick(e)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-md text-[11px] font-mono transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(e._id)}
                        className="px-3 py-1 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 rounded-md text-[11px] font-mono transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center border border-white/10 rounded-xl bg-[#0E101A] text-white/40 font-mono text-xs">
          No matching events found.
        </div>
      )}
    </div>
  );
}
