"use client";

import React, { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiLoader, 
  FiCalendar, 
  FiClock, 
  FiEdit2, 
  FiTrash2, 
  FiAward, 
  FiUsers, 
  FiUser, 
  FiExternalLink, 
  FiBookOpen, 
  FiMessageCircle,
  FiGlobe,
  FiMapPin
} from 'react-icons/fi';
import { EventType } from '../types';
import { EventForm } from './event-form';
import { ResultModal } from './result-modal';
import { getEventDynamicStatus } from '@/lib/event-status';

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
  onRefreshEvents?: () => void;
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
  onRefreshEvents,
}: EventsTabProps) {
  const [selectedResultEvent, setSelectedResultEvent] = useState<EventType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  // Filter events based on active category tab & search
  const displayedEvents = useMemo(() => {
    return filteredEvents.filter((event) => {
      const timing = getEventDynamicStatus(event as any);
      if (categoryFilter === 'live' && timing.status !== 'live') return false;
      if (categoryFilter === 'upcoming' && timing.status !== 'upcoming') return false;
      if (categoryFilter === 'past' && timing.status !== 'past') return false;
      return true;
    });
  }, [filteredEvents, categoryFilter]);

  const counts = useMemo(() => {
    let live = 0, upcoming = 0, past = 0;
    filteredEvents.forEach((e) => {
      const timing = getEventDynamicStatus(e as any);
      if (timing.status === 'live') live++;
      else if (timing.status === 'upcoming') upcoming++;
      else past++;
    });
    return { all: filteredEvents.length, live, upcoming, past };
  }, [filteredEvents]);

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
    <div className="space-y-6 font-sans">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Manage Events</h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 font-bold">
              {filteredEvents.length}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Create, update or remove club events, configure dynamic registration fields, and declare podium winners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="size-3.5 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search events..."
              value={eventSearch}
              onChange={e => setEventSearch(e.target.value)}
              className="bg-[#0f0f0f] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF355E]/50 font-sans w-48 sm:w-64 transition-all"
            />
          </div>

          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-white text-black hover:bg-white/90 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg"
          >
            <FiPlus className="size-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
            categoryFilter === 'all'
              ? 'bg-white text-black font-bold shadow-md'
              : 'bg-[#141414] border border-white/10 text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          All Events ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter('live')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
            categoryFilter === 'live'
              ? 'bg-emerald-500 text-black font-bold shadow-md'
              : 'bg-[#141414] border border-white/10 text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          Live Now ({counts.live})
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter('upcoming')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
            categoryFilter === 'upcoming'
              ? 'bg-blue-500 text-white font-bold shadow-md'
              : 'bg-[#141414] border border-white/10 text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          Upcoming ({counts.upcoming})
        </button>

        <button
          type="button"
          onClick={() => setCategoryFilter('past')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
            categoryFilter === 'past'
              ? 'bg-white/20 text-white font-bold shadow-md'
              : 'bg-[#141414] border border-white/10 text-white/60 hover:text-white hover:border-white/20'
          }`}
        >
          Archived / Past ({counts.past})
        </button>
      </div>

      {/* Events Cards List */}
      {dataLoading ? (
        <div className="py-20 text-center text-white/40 font-mono text-xs flex flex-col items-center justify-center gap-3 border border-white/10 rounded-2xl bg-[#141414]">
          <FiLoader className="size-6 animate-spin text-[#FF355E]" />
          <span>Loading events directory...</span>
        </div>
      ) : displayedEvents.length > 0 ? (
        <div className="space-y-4">
          {displayedEvents.map((event) => {
            const timing = getEventDynamicStatus(event as any);
            const { isLive, isUpcoming, isPast, label } = timing;
            const hasWinners = Boolean((event as any).winners?.overall?.length > 0 || (event as any).winners?.published);

            return (
              <div
                key={event._id}
                className="p-6 rounded-2xl border border-white/10 bg-[#141414] hover:border-white/20 transition-all shadow-md group relative flex flex-col justify-between gap-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Main Details */}
                  <div className="flex-1 space-y-3">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Timing Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border uppercase ${
                        isLive 
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' 
                          : isUpcoming 
                          ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' 
                          : 'border-white/10 bg-white/5 text-white/50'
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          isLive ? 'bg-emerald-400 animate-ping' : isUpcoming ? 'bg-blue-400' : 'bg-white/40'
                        }`} />
                        {label}
                      </span>

                      {/* Registration Open/Closed Badge */}
                      {timing.isRegistrationClosed ? (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-red-300 bg-red-500/10 border border-red-500/20 uppercase font-semibold">
                          Registration Closed
                        </span>
                      ) : event.registrationDeadline ? (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-amber-300 bg-amber-500/10 border border-amber-500/20 font-semibold">
                          Deadline: {new Date(event.registrationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 font-semibold uppercase">
                          Registrations Open
                        </span>
                      )}

                      {/* Registration Type Badge */}
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-white/70 bg-white/5 border border-white/10 uppercase flex items-center gap-1">
                        {event.registrationType === 'team' ? (
                          <>
                            <FiUsers className="size-3 text-blue-400" />
                            Team ({event.teamMinSize || 2}–{event.teamMaxSize || 4})
                          </>
                        ) : (
                          <>
                            <FiUser className="size-3 text-emerald-400" />
                            Solo Entry
                          </>
                        )}
                      </span>

                      {/* Custom Form Badge */}
                      {event.useCustomForm && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-[#FF355E] bg-[#FF355E]/10 border border-[#FF355E]/30 font-semibold">
                          Custom Form
                        </span>
                      )}

                      {/* Google Form Badge */}
                      {event.forceGoogleForm && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/20 font-semibold">
                          Google Form
                        </span>
                      )}

                      {/* Results Declared Badge */}
                      {hasWinners && (
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full text-amber-300 bg-amber-500/10 border border-amber-500/30 font-bold flex items-center gap-1">
                          <FiAward className="size-3 text-amber-400" />
                          Results Published
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
                        {event.title}
                      </h2>
                      {event.description && (
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mt-1 font-sans">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Schedule & Links Meta Row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 pt-1">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <FiCalendar className="size-3.5 text-[#FF355E]" />
                        <span>{event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : 'Date TBA'}</span>
                      </div>

                      {event.time && (
                        <div className="flex items-center gap-1.5 text-white/80">
                          <FiClock className="size-3.5 text-amber-400" />
                          <span>{event.time}</span>
                        </div>
                      )}

                      {event.eventType && (
                        <div className="flex items-center gap-1.5 text-white/60 capitalize">
                          {event.eventType === 'online' ? <FiGlobe className="size-3.5 text-blue-400" /> : <FiMapPin className="size-3.5 text-emerald-400" />}
                          <span>{event.eventType}</span>
                        </div>
                      )}

                      {event.ruleBookUrl && (
                        <a 
                          href={event.ruleBookUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 text-[#FF355E] hover:underline"
                        >
                          <FiBookOpen className="size-3.5" /> Rule Book
                        </a>
                      )}

                      {event.whatsappGroupLink && (
                        <a 
                          href={event.whatsappGroupLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 text-emerald-400 hover:underline"
                        >
                          <FiMessageCircle className="size-3.5" /> WhatsApp
                        </a>
                      )}
                    </div>

                    {/* Additional Custom Fields Tag Pills */}
                    {event.registrationFields && event.registrationFields.length > 0 && (
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block font-semibold">
                          Custom Form Fields ({event.registrationFields.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {event.registrationFields.map((field: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10"
                            >
                              {field.label} {field.required ? <span className="text-[#FF355E]">*</span> : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Action Buttons Toolbar */}
                  <div className="flex sm:flex-row lg:flex-col items-center gap-2 shrink-0 pt-2 lg:pt-0">
                    {/* Manage Results / Winners Trophy Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedResultEvent(event)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 text-xs font-mono font-medium shadow-sm w-full sm:w-auto lg:w-36 ${
                        hasWinners 
                          ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' 
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/40'
                      }`}
                      title="Declare &amp; publish event winners"
                    >
                      <FiAward className="size-4 text-amber-400" />
                      <span>{hasWinners ? 'Edit Results' : 'Results'}</span>
                    </button>

                    {/* Edit Event Button */}
                    <button
                      type="button"
                      onClick={() => onEditClick(event)}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 text-xs font-mono w-full sm:w-auto lg:w-36"
                      title="Edit Event Details"
                    >
                      <FiEdit2 className="size-4 text-blue-400" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Event Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteClick(event._id)}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center gap-1.5 text-xs font-mono w-full sm:w-auto lg:w-36"
                      title="Delete Event"
                    >
                      <FiTrash2 className="size-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#141414] space-y-3 font-sans">
          <FiCalendar className="size-12 text-white/20 mx-auto" />
          <p className="text-base font-bold text-white tracking-tight">No events found</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-mono">
            {eventSearch
              ? `No events matched your search "${eventSearch}". Try clearing your search query.`
              : 'No events found in this category. Click "+ Create Event" to create your first event!'}
          </p>
          {eventSearch && (
            <button
              type="button"
              onClick={() => setEventSearch('')}
              className="mt-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Result / Podium Modal */}
      {selectedResultEvent && (
        <ResultModal
          event={selectedResultEvent}
          onClose={() => setSelectedResultEvent(null)}
          onSuccess={() => {
            setSelectedResultEvent(null);
            onRefreshEvents?.();
          }}
        />
      )}
    </div>
  );
}
