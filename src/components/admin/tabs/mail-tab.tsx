"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiSend, 
  FiRefreshCw, 
  FiAward, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLoader, 
  FiChevronDown, 
  FiChevronUp,
  FiMessageSquare,
  FiClock
} from 'react-icons/fi';
import { EventType } from '../types';

interface EmailLogItem {
  _id: string;
  eventId: string;
  registrationId?: string;
  emailType: 'registration' | 'participation' | 'certificate' | 'broadcast';
  recipientEmail: string;
  recipientName?: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  failedAt?: string;
  errorMessage?: string;
  retryCount?: number;
  createdAt: string;
}

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
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionSending, setActionSending] = useState<'participation' | 'certificate' | null>(null);
  const [showBroadcastCompose, setShowBroadcastCompose] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedEvent = events.find(e => e._id === selectedEventId);
  const logsCacheRef = React.useRef<Record<string, EmailLogItem[]>>({});

  // Fetch logs whenever event changes (uses in-memory cache if available)
  useEffect(() => {
    if (selectedEventId) {
      fetchLogs(selectedEventId, false);
    } else {
      setLogs([]);
    }
    setStatusMessage(null);
  }, [selectedEventId]);

  const fetchLogs = async (eventId: string, force = false) => {
    if (!eventId) return;

    if (!force && logsCacheRef.current[eventId]) {
      setLogs(logsCacheRef.current[eventId]);
      return;
    }

    try {
      setLogsLoading(true);
      const res = await fetch(`/api/admin/mail/logs?eventId=${eventId}`);
      const data = await res.json();
      if (data.success) {
        const logList = data.logs || [];
        logsCacheRef.current[eventId] = logList;
        setLogs(logList);
      }
    } catch (err) {
      console.error('Error fetching email logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSendParticipation = async () => {
    if (!selectedEventId) return;
    if (!window.confirm("Send participation emails to all attendees marked as 'Present'?")) return;
    
    try {
      setActionSending('participation');
      setStatusMessage(null);
      const res = await fetch(`/api/admin/mail/event/${selectedEventId}/participation`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch emails.');
      
      setStatusMessage({ type: 'success', text: data.message || 'Participation emails dispatched.' });
      fetchLogs(selectedEventId);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error sending participation emails.' });
    } finally {
      setActionSending(null);
    }
  };

  const handleSendCertificates = async () => {
    if (!selectedEventId) return;
    if (!window.confirm("Send certificates to all verified event participants?")) return;

    try {
      setActionSending('certificate');
      setStatusMessage(null);
      const res = await fetch(`/api/admin/mail/event/${selectedEventId}/certificate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch certificates.');

      setStatusMessage({ type: 'success', text: data.message || 'Certificate emails dispatched.' });
      fetchLogs(selectedEventId);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error sending certificates.' });
    } finally {
      setActionSending(null);
    }
  };

  const handleResend = async (logId: string) => {
    try {
      const res = await fetch(`/api/admin/mail/resend/${logId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Resend failed.');
      fetchLogs(selectedEventId);
    } catch (err: any) {
      alert(err.message || 'Failed to resend email');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Mail Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Send event communications, participation acknowledgments, certificates, and view delivery ledgers.
          </p>
        </div>

        <div className="relative min-w-[220px]">
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 pl-3 pr-9 text-xs text-white focus:outline-none focus:border-white/30 font-sans appearance-none cursor-pointer"
          >
            <option value="">Select Event</option>
            {events.map(e => (
              <option key={e._id} value={e._id}>{e.title}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
        </div>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage && (
        <div className={`p-3 rounded-md text-xs font-medium border ${
          statusMessage.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300'
            : 'bg-red-950/40 border-red-500/20 text-red-300'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* No Event Selected Empty State */}
      {!selectedEventId ? (
        <div className="py-16 text-center border border-white/10 rounded-lg bg-[#121626] space-y-2">
          <FiMail className="size-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">Select an event to manage emails and view delivery logs.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Participation Emails */}
            <div className="bg-[#121626] border border-white/10 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">Participation Emails</h3>
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md">
                    <FiMail className="size-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send participation acknowledgement emails to all attendees marked as &apos;Present&apos;.
                </p>

                {/* Event Completion Indicator / Quick Toggle */}
                {selectedEvent && (
                  <div className={`p-2.5 rounded-md border text-[11px] font-mono flex items-center justify-between gap-2 ${
                    selectedEvent.completed || selectedEvent.status === 'past'
                      ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300'
                      : 'bg-amber-950/30 border-amber-500/20 text-amber-300'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <FiCheckCircle className={`size-3.5 shrink-0 ${
                        selectedEvent.completed || selectedEvent.status === 'past' ? 'text-emerald-400' : 'text-amber-400'
                      }`} />
                      <span>{selectedEvent.completed || selectedEvent.status === 'past' ? 'Event Completed' : 'Event Active'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const isDone = Boolean(selectedEvent.completed || selectedEvent.status === 'past');
                        const nextVal = !isDone;
                        const res = await fetch(`/api/events/${selectedEvent._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ completed: nextVal, status: nextVal ? 'past' : 'upcoming' })
                        });
                        const data = await res.json();
                        if (data.success) {
                          selectedEvent.completed = nextVal;
                          selectedEvent.status = nextVal ? 'past' : 'upcoming';
                          setStatusMessage({ type: 'success', text: nextVal ? 'Event marked as completed.' : 'Event marked as active.' });
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[10px] font-sans transition-colors shrink-0"
                    >
                      {selectedEvent.completed || selectedEvent.status === 'past' ? 'Re-open' : 'Mark Completed'}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleSendParticipation}
                disabled={actionSending !== null}
                className="w-full py-2 px-3 bg-white text-black font-semibold rounded-md text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {actionSending === 'participation' ? (
                  <><FiLoader className="size-3.5 animate-spin" /> Sending...</>
                ) : (
                  <><FiSend className="size-3.5" /> Send Emails</>
                )}
              </button>
            </div>

            {/* Card 2: Certificates */}
            <div className="bg-[#121626] border border-white/10 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">Certificates</h3>
                  <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md">
                    <FiAward className="size-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send digital certificates directly to verified event participants and winners.
                </p>
              </div>
              <button
                onClick={handleSendCertificates}
                disabled={actionSending !== null}
                className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold rounded-md text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {actionSending === 'certificate' ? (
                  <><FiLoader className="size-3.5 animate-spin" /> Sending...</>
                ) : (
                  <><FiAward className="size-3.5" /> Send Certificates</>
                )}
              </button>
            </div>

            {/* Card 3: Custom Broadcast Composer Toggle */}
            <div className="bg-[#121626] border border-white/10 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all sm:col-span-2 lg:col-span-1">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">Broadcast Announcement</h3>
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md">
                    <FiMessageSquare className="size-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compose and dispatch custom email updates to all registered attendees.
                </p>
              </div>
              <button
                onClick={() => setShowBroadcastCompose(prev => !prev)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold rounded-md text-xs transition-all flex items-center justify-center gap-1.5"
              >
                {showBroadcastCompose ? (
                  <><FiChevronUp className="size-3.5" /> Hide Compose Box</>
                ) : (
                  <><FiMessageSquare className="size-3.5" /> Compose Broadcast</>
                )}
              </button>
            </div>
          </div>

          {/* Broadcast Compose Box (Collapsible) */}
          {showBroadcastCompose && (
            <form onSubmit={async (e) => {
              await onSendMail(e);
              fetchLogs(selectedEventId);
            }} className="p-5 border border-white/10 rounded-lg bg-[#121626] space-y-4">
              <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Compose Custom Broadcast
                </h3>
              </div>

              {mailMessage && (
                <div className="p-3 border border-emerald-500/20 bg-emerald-950/40 rounded-md text-xs font-mono text-emerald-300">
                  {mailMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Email Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Round 1 Schedule Update"
                  value={mailSubject}
                  onChange={e => setMailSubject(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Email Message *</label>
                <textarea
                  placeholder="Write your announcement details..."
                  rows={5}
                  value={mailBody}
                  onChange={e => setMailBody(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 resize-y font-sans"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={mailSending}
                  className="px-5 py-2 bg-white text-black font-semibold rounded-md text-xs hover:bg-slate-200 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {mailSending ? <FiLoader className="size-3.5 animate-spin" /> : <FiSend className="size-3.5" />}
                  {mailSending ? 'Sending Dispatch...' : 'Dispatch Broadcast'}
                </button>
              </div>
            </form>
          )}

          {/* Email Delivery Logs Ledger */}
          <div className="border border-white/10 rounded-lg bg-[#121626] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Email Delivery Logs</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time status of outgoing communications for this event.</p>
              </div>
              <button
                onClick={() => fetchLogs(selectedEventId)}
                className="p-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Refresh Logs"
              >
                <FiRefreshCw className={`size-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {logsLoading ? (
              <div className="py-14 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
                <FiLoader className="size-4 animate-spin" /> Loading email logs...
              </div>
            ) : logs.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead className="sticky top-0 bg-[#0D1020] z-10 border-b border-white/10">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Dispatched Time</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-xs text-slate-300">
                    {logs.map((log) => {
                      const isSent = log.status === 'sent';
                      const isFailed = log.status === 'failed';

                      return (
                        <tr key={log._id} className="hover:bg-white/[0.025] transition-colors">
                          {/* Recipient */}
                          <td className="py-3 px-4">
                            <p className="text-white font-medium text-xs">{log.recipientEmail}</p>
                            {log.recipientName && (
                              <p className="text-[11px] text-slate-500">{log.recipientName}</p>
                            )}
                          </td>

                          {/* Email Type */}
                          <td className="py-3 px-4 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 uppercase">
                              {log.emailType}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
                                isSent
                                  ? 'border-emerald-500/20 bg-emerald-950/40 text-emerald-400'
                                  : isFailed
                                  ? 'border-red-500/20 bg-red-950/40 text-red-400'
                                  : 'border-amber-500/20 bg-amber-950/40 text-amber-400'
                              }`}>
                                {isSent ? (
                                  <FiCheckCircle className="size-3 text-emerald-400" />
                                ) : isFailed ? (
                                  <FiAlertCircle className="size-3 text-red-400" />
                                ) : (
                                  <FiClock className="size-3 text-amber-400" />
                                )}
                                <span className="capitalize">{log.status}</span>
                              </span>
                              {log.errorMessage && (
                                <p className="text-[10px] text-red-400 max-w-[200px] truncate">{log.errorMessage}</p>
                              )}
                            </div>
                          </td>

                          {/* Time */}
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(log.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-right">
                            {isFailed ? (
                              <button
                                onClick={() => handleResend(log._id)}
                                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-colors"
                              >
                                Resend
                              </button>
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs font-sans">
                No email delivery logs recorded yet for this event.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
