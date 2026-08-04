"use client";

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { EventType } from '../types';

interface MailTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  mailSubject: string;
  setMailSubject: (subj: string) => void;
  mailBody: string;
  setMailBody: (body: string) => void;
  mailSending: boolean;
  mailMessage: string | null;
  onSendMail: (e: React.FormEvent) => void;
}

export function MailTab({
  events,
  selectedEventId,
  setSelectedEventId,
  mailSubject,
  setMailSubject,
  mailBody,
  setMailBody,
  mailSending,
  mailMessage,
  onSendMail,
}: MailTabProps) {
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Mail Manager</h1>
        <p className="text-xs text-white/50 mt-0.5">Send notification emails directly to registered event participants.</p>
      </div>

      <form onSubmit={onSendMail} className="p-6 border border-white/10 rounded-xl bg-[#0E101A] space-y-5 shadow-sm">
        {mailMessage && (
          <div className="p-3 border border-emerald-500/30 bg-emerald-500/10 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
            <FiCheck className="size-4 shrink-0" /> {mailMessage}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block font-mono">Target Event *</label>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full bg-[#07080E] border border-white/15 rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-white/30"
            required
          >
            <option value="">Select Event</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block font-mono">Email Subject *</label>
          <input
            type="text"
            placeholder="e.g. Update regarding PTSC Code Odyssey"
            value={mailSubject}
            onChange={e => setMailSubject(e.target.value)}
            className="w-full bg-[#07080E] border border-white/15 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block font-mono">Email Body *</label>
          <textarea
            placeholder="Write broadcast message contents..."
            rows={6}
            value={mailBody}
            onChange={e => setMailBody(e.target.value)}
            className="w-full bg-[#07080E] border border-white/15 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-y"
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={mailSending}
            className="px-6 py-2.5 bg-white text-black font-mono font-semibold rounded-lg text-xs hover:bg-white/90 transition-all shadow-md"
          >
            {mailSending ? 'Sending Broadcast...' : 'Send Broadcast Email'}
          </button>
        </div>
      </form>
    </div>
  );
}
