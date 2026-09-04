"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  FiMail, 
  FiSend, 
  FiRefreshCw, 
  FiFileText, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLoader,
  FiAward,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { EventType } from "../types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const broadcastSchema = z.object({
  mailSubject: z.string().min(1, "Email subject is required"),
  mailBody: z.string().min(1, "Email body is required"),
});

type BroadcastFormValues = z.infer<typeof broadcastSchema>;

interface MailTabProps {
  events: EventType[];
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  mailSubject?: string;
  setMailSubject?: (subj: string) => void;
  mailBody?: string;
  setMailBody?: (body: string) => void;
  mailSending?: boolean;
  mailMessage?: string | null;
  onSendMail?: (e: React.FormEvent) => void;
}

export function MailTab({
  events,
  selectedEventId,
  setSelectedEventId,
}: MailTabProps) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [sendingParticipation, setSendingParticipation] = useState(false);
  const [sendingCertificate, setSendingCertificate] = useState(false);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      mailSubject: "",
      mailBody: "",
    },
  });

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const fetchLogs = async (eventId: string) => {
    if (!eventId) {
      setLogs([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/mail/logs?eventId=${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data?.logs) ? data.logs : []);
      }
    } catch (error) {
      console.error("Error fetching mail logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchLogs(selectedEventId);
    } else {
      setLogs([]);
    }
  }, [selectedEventId]);

  const handleSendParticipation = async () => {
    if (!selectedEventId) return;
    if (!window.confirm("Send participation confirmation emails to all present attendees?")) return;

    try {
      setSendingParticipation(true);
      const res = await fetch(`/api/admin/mail/event/${selectedEventId}/participation`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send participation emails");
      }
      showNotification(data.message || "Participation emails queued successfully");
      fetchLogs(selectedEventId);
    } catch (err: any) {
      showNotification(err.message || "Failed to dispatch participation emails", "error");
    } finally {
      setSendingParticipation(false);
    }
  };

  const handleSendCertificates = async () => {
    if (!selectedEventId) return;
    if (!window.confirm("Send certificates to all attended participants and declared winners?")) return;

    try {
      setSendingCertificate(true);
      const res = await fetch(`/api/admin/mail/event/${selectedEventId}/certificate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send certificates");
      }
      showNotification(data.message || "Certificate emails queued successfully");
      fetchLogs(selectedEventId);
    } catch (err: any) {
      showNotification(err.message || "Failed to dispatch certificates", "error");
    } finally {
      setSendingCertificate(false);
    }
  };

  const handleSendBroadcast = async (values: BroadcastFormValues) => {
    if (!selectedEventId) return;
    try {
      setSendingBroadcast(true);
      const res = await fetch("/api/admin/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          subject: values.mailSubject,
          body: values.mailBody,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send broadcast email");
      }
      showNotification(data.message || "Broadcast email sent successfully");
      form.reset();
      setShowBroadcastForm(false);
      fetchLogs(selectedEventId);
    } catch (err: any) {
      showNotification(err.message || "Failed to dispatch broadcast email", "error");
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleResend = async (logId: string) => {
    try {
      const res = await fetch(`/api/admin/mail/resend/${logId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to resend email");
      }
      showNotification("Email resend queued successfully");
      fetchLogs(selectedEventId);
    } catch (err: any) {
      showNotification(err.message || "Failed to resend email", "error");
    }
  };

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Event Select */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Mail Management</h1>
            {selectedEventId && (
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 font-bold">
                {logs.length} dispatches
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1">
            Dispatch participation emails, certificates, and custom broadcast announcements directly to participants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-[#0f0f0f] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF355E] font-sans transition-all min-w-[200px]"
          >
            <option value="">-- Select Event --</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => selectedEventId && fetchLogs(selectedEventId)}
            disabled={loading || !selectedEventId}
            className="p-2 rounded-xl border border-white/10 bg-[#141414] text-white/70 hover:text-white hover:bg-white/5 transition-all"
            title="Refresh mail logs"
          >
            <FiRefreshCw className={`size-4 ${loading ? "animate-spin text-[#FF355E]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
            feedbackMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <FiCheckCircle className="size-4 shrink-0 text-emerald-400" />
          ) : (
            <FiAlertCircle className="size-4 shrink-0 text-red-400" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {!selectedEventId ? (
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#141414] space-y-3 font-sans">
          <FiMail className="size-12 text-white/20 mx-auto" />
          <p className="text-base font-bold text-white tracking-tight">No event selected</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-mono">
            Please choose an event from the dropdown above to manage outgoing email dispatches and inspection logs.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Participation Emails Card */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#141414] hover:border-white/20 transition-all shadow-sm flex flex-col justify-between gap-4 group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                    Participation Emails
                  </h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Send participation confirmation emails to all registered attendees marked as &quot;Present&quot;.
                  </p>
                </div>
                <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FiMail className="size-5" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendParticipation}
                disabled={sendingParticipation}
                className="w-full h-10 rounded-xl bg-white text-black hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {sendingParticipation ? (
                  <>
                    <FiLoader className="size-3.5 animate-spin text-black" /> Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="size-3.5" /> Send Emails
                  </>
                )}
              </button>
            </div>

            {/* Certificates Card */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#141414] hover:border-white/20 transition-all shadow-sm flex flex-col justify-between gap-4 group">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                    Award Certificates
                  </h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Dispatch verified certificates of completion &amp; merit to attended participants and winners.
                  </p>
                </div>
                <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <FiAward className="size-5" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendCertificates}
                disabled={sendingCertificate}
                className="w-full h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 font-mono font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {sendingCertificate ? (
                  <>
                    <FiLoader className="size-3.5 animate-spin text-white" /> Sending...
                  </>
                ) : (
                  <>
                    <FiFileText className="size-3.5" /> Send Certificates
                  </>
                )}
              </button>
            </div>

            {/* Custom Broadcast Announcement Card */}
            <div className="p-5 rounded-2xl border border-white/10 bg-[#141414] hover:border-white/20 transition-all shadow-sm flex flex-col justify-between gap-4 group sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                    Custom Broadcast
                  </h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    Compose and dispatch custom announcements to all event participants.
                  </p>
                </div>
                <div className="size-10 rounded-xl bg-[#FF355E]/10 border border-[#FF355E]/20 flex items-center justify-center text-[#FF355E] shrink-0">
                  <FiSend className="size-5" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBroadcastForm(!showBroadcastForm)}
                className="w-full h-10 rounded-xl bg-[#FF355E]/15 border border-[#FF355E]/30 text-[#FF355E] hover:bg-[#FF355E]/25 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>{showBroadcastForm ? "Close Composer" : "Compose Message"}</span>
                {showBroadcastForm ? <FiChevronUp className="size-3.5" /> : <FiChevronDown className="size-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Custom Broadcast Form */}
          {showBroadcastForm && (
            <div className="p-6 rounded-2xl border border-[#FF355E]/30 bg-[#141414] shadow-md space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FiMail className="size-4 text-[#FF355E]" /> Broadcast to Participants: {selectedEvent?.title}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  This message will be dispatched to all registered participants for this event.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSendBroadcast)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mailSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Venue Change or Schedule Update"
                            disabled={sendingBroadcast}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Message Body *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Write your email announcement here..."
                            disabled={sendingBroadcast}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBroadcastForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-white/70 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingBroadcast}
                      className="px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                    >
                      {sendingBroadcast ? (
                        <>
                          <FiLoader className="size-3.5 animate-spin text-black" /> Dispatching...
                        </>
                      ) : (
                        <>
                          <FiSend className="size-3.5" /> Dispatch Broadcast
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          )}

          {/* Email Logs Section */}
          <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-md">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <FiFileText className="size-4 text-white/60" /> Email Dispatch Logs
                </h3>
                <p className="text-[11px] text-white/50">History of automated notifications and certificates sent for this event.</p>
              </div>

              <button
                type="button"
                onClick={() => fetchLogs(selectedEventId)}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                title="Refresh logs"
              >
                <FiRefreshCw className={`size-4 ${loading ? "animate-spin text-[#FF355E]" : ""}`} />
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-white/40 font-mono text-xs flex flex-col items-center justify-center gap-2">
                <FiLoader className="size-5 animate-spin text-[#FF355E]" />
                <span>Loading email logs...</span>
              </div>
            ) : logs.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-10">
                    <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/60">
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-white/80">
                    {logs.map((log) => {
                      const isSent = log.status === "sent";
                      const isFailed = log.status === "failed";

                      return (
                        <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4">
                            <p className="text-white font-medium text-xs">{log.recipientEmail}</p>
                            <p className="text-[11px] text-white/40 font-mono">{log.recipientName || "Participant"}</p>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/5 text-white/70 border border-white/10">
                              {log.emailType || "general"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono text-xs">
                              {isSent ? (
                                <FiCheckCircle className="size-3.5 text-emerald-400 shrink-0" />
                              ) : isFailed ? (
                                <FiAlertCircle className="size-3.5 text-red-400 shrink-0" />
                              ) : (
                                <FiLoader className="size-3.5 text-amber-400 animate-spin shrink-0" />
                              )}
                              <span
                                className={`capitalize ${
                                  isSent
                                    ? "text-emerald-400"
                                    : isFailed
                                    ? "text-red-400"
                                    : "text-amber-400"
                                }`}
                              >
                                {log.status}
                              </span>
                            </div>
                            {log.error && (
                              <p className="text-[10px] text-red-400 mt-0.5 max-w-xs truncate font-mono" title={log.error}>
                                {log.error}
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-white/50">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isFailed && (
                              <button
                                type="button"
                                onClick={() => handleResend(log._id)}
                                className="text-xs font-mono text-[#FF355E] hover:underline"
                              >
                                Resend
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-white/40 font-mono text-xs">
                No email dispatch logs found for this event.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
