"use client";

import React from 'react';
import { FiSearch, FiPlus, FiLoader, FiCalendar, FiClock, FiEdit2, FiTrash2, FiTag, FiUsers, FiMapPin, FiGlobe, FiVideo, FiCheckCircle } from 'react-icons/fi';
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
  onToggleComplete?: (event: EventType) => void;
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
  onToggleComplete,
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
  // Show create/edit form
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
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Events Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, schedule and manage all PTSC events and competitions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <FiSearch className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={eventSearch}
              onChange={e => setEventSearch(e.target.value)}
              className="bg-[#090B14] border border-white/15 rounded-md py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 font-sans w-48 sm:w-60"
            />
          </div>
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-black text-xs font-semibold rounded-md hover:bg-slate-200 transition-colors shadow-sm shrink-0"
          >
            <FiPlus className="size-3.5" /> New Event
          </button>
        </div>
      </div>

      {/* Loading */}
      {dataLoading && (
        <div className="py-14 text-center border border-white/10 rounded-lg bg-[#121626] flex items-center justify-center gap-2 text-xs text-slate-400">
          <FiLoader className="size-4 animate-spin" /> Loading events...
        </div>
      )}

      {/* Events Card List */}
      {!dataLoading && filteredEvents.length > 0 && (
        <div className="space-y-3">
          {filteredEvents.map(event => {
            const isUpcoming = event.status === 'upcoming';
            const isOngoing = event.status === 'ongoing';
            const isPast = !isUpcoming && !isOngoing;
            const eventDate = event.date ? new Date(event.date) : null;
            const isPastDate = eventDate ? eventDate < new Date() : false;

            return (
              <div
                key={event._id}
                className="bg-[#121626] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    {/* Title + Status + Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                      {event.completed || event.status === 'past' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 font-semibold">
                          <FiCheckCircle className="size-3 text-emerald-400" />
                          Completed
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                          isUpcoming
                            ? 'border-emerald-500/20 bg-emerald-950/40 text-emerald-400'
                            : isOngoing
                            ? 'border-amber-500/20 bg-amber-950/40 text-amber-400'
                            : 'border-white/10 bg-white/5 text-slate-400'
                        }`}>
                          <span className={`size-1.5 rounded-full ${isUpcoming ? 'bg-emerald-400' : isOngoing ? 'bg-amber-400' : 'bg-white/30'}`} />
                          {event.status || 'draft'}
                        </span>
                      )}
                      {event.eventType === 'online' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border border-cyan-500/20 bg-cyan-950/40 text-cyan-400">
                          <FiGlobe className="size-3" /> Online {event.platform ? `(${event.platform})` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border border-white/10 bg-white/5 text-slate-400">
                          <FiMapPin className="size-3" /> Offline
                        </span>
                      )}
                      {event.useCustomForm && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono border border-blue-500/20 bg-blue-950/40 text-blue-400">
                          Custom Form
                        </span>
                      )}
                      {event.forceGoogleForm && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono border border-purple-500/20 bg-purple-950/40 text-purple-400">
                          Google Form
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Date / Time / Type / Venue / Meet Link row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      {eventDate && (
                        <div className="flex items-center gap-1.5">
                          <FiCalendar className="size-3.5 shrink-0" />
                          {eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-1.5">
                          <FiClock className="size-3.5 shrink-0" />
                          {event.time}
                        </div>
                      )}
                      {event.eventType === 'online' ? (
                        event.meetLink && (
                          <a
                            href={event.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                            onClick={e => e.stopPropagation()}
                          >
                            <FiVideo className="size-3.5 shrink-0" />
                            <span>Join Link</span>
                          </a>
                        )
                      ) : (
                        event.venue && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <FiMapPin className="size-3.5 shrink-0 text-slate-400" />
                            <span>{event.venue}</span>
                          </div>
                        )
                      )}
                      <div className="flex items-center gap-1.5">
                        <FiUsers className="size-3.5 shrink-0" />
                        <span className="uppercase font-mono text-[11px]">
                          {event.registrationType || 'individual'}
                        </span>
                        {event.registrationType === 'team' && event.teamMinSize && event.teamMaxSize && (
                          <span className="text-slate-500 text-[11px]">
                            ({event.teamMinSize}–{event.teamMaxSize})
                          </span>
                        )}
                      </div>
                      {event.registrationDeadline && (
                        <div className="flex items-center gap-1.5 text-amber-400/90">
                          <FiClock className="size-3.5 shrink-0" />
                          <span>Deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}, {new Date(event.registrationDeadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>

                    {/* Registration fields chips */}
                    {event.registrationFields && event.registrationFields.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <FiTag className="size-3 text-slate-500 shrink-0" />
                        {event.registrationFields.map((field: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400"
                          >
                            {field.label}{field.required ? ' *' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Cover image + Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                    {/* Cover image thumbnail */}
                    {event.coverImageUrl && (
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-20 h-14 rounded object-cover border border-white/10 shrink-0"
                      />
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {onToggleComplete && (
                        <button
                          type="button"
                          onClick={() => onToggleComplete(event)}
                          title={event.completed || event.status === 'past' ? "Reopen event as active" : "Mark event as completed"}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                            event.completed || event.status === 'past'
                              ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <FiCheckCircle className={`size-3.5 ${event.completed || event.status === 'past' ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span>{event.completed || event.status === 'past' ? 'Completed' : 'Mark Completed'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => onEditClick(event)}
                        title="Edit event"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white text-xs font-medium transition-all"
                      >
                        <FiEdit2 className="size-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(event._id)}
                        title="Delete event"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-slate-400 hover:bg-red-950/40 hover:border-red-500/20 hover:text-red-400 text-xs font-medium transition-all"
                      >
                        <FiTrash2 className="size-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!dataLoading && filteredEvents.length === 0 && (
        <div className="py-16 text-center border border-white/10 rounded-lg bg-[#121626] space-y-2">
          <FiCalendar className="size-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">
            {eventSearch ? 'No events match your search.' : 'No events yet. Click "New Event" to publish your first competition.'}
          </p>
        </div>
      )}
    </div>
  );
}
