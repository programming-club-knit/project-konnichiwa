"use client";

import React, { useState, useEffect } from "react";
import { 
  FiAward, 
  FiX, 
  FiPlus, 
  FiTrash2, 
  FiCheck, 
  FiLoader,
  FiUser,
  FiUsers
} from "react-icons/fi";
import { EventType } from "../types";

interface ResultModalProps {
  event: EventType;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResultModal({ event, onClose, onSuccess }: ResultModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [resultWinners, setResultWinners] = useState<{
    overall: string[];
    overallFirstYear: string;
    overallFirstYearGirls: string;
    overallGirls: string;
    dynamicCategories: { title: string; winners: string[] }[];
    published: boolean;
  }>({
    overall: ["", "", ""],
    overallFirstYear: "",
    overallFirstYearGirls: "",
    overallGirls: "",
    dynamicCategories: [],
    published: false,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/registrations?eventId=${event._id}&deleted=false`);
        if (!res.ok) throw new Error("Failed to fetch event registrations");
        const data = await res.json();
        
        if (!isCancelled) {
          const regs = Array.isArray(data?.registrations) ? data.registrations : [];
          setEventRegistrations(regs);

          // Initialize winners from event data if they exist
          let overallWinners = (event as any).winners?.overall || [];
          if (!Array.isArray(overallWinners)) {
            overallWinners = overallWinners ? [overallWinners] : [];
          }
          const paddedOverall = [...overallWinners];
          while (paddedOverall.length < 3) paddedOverall.push("");

          setResultWinners({
            overall: paddedOverall.slice(0, 3).map((w: any) => (typeof w === "object" ? w._id : w) || ""),
            overallFirstYear: (typeof (event as any).winners?.overallFirstYear === "object" 
              ? (event as any).winners?.overallFirstYear?._id 
              : (event as any).winners?.overallFirstYear) || "",
            overallFirstYearGirls: (typeof (event as any).winners?.overallFirstYearGirls === "object"
              ? (event as any).winners?.overallFirstYearGirls?._id
              : (event as any).winners?.overallFirstYearGirls) || "",
            overallGirls: (typeof (event as any).winners?.overallGirls === "object"
              ? (event as any).winners?.overallGirls?._id
              : (event as any).winners?.overallGirls) || "",
            dynamicCategories: Array.isArray((event as any).winners?.dynamicCategories)
              ? (event as any).winners.dynamicCategories.map((c: any) => ({
                  title: c.title || "",
                  winners: Array.isArray(c.winners)
                    ? c.winners.map((w: any) => (typeof w === "object" ? w._id : w))
                    : [],
                }))
              : [],
            published: Boolean((event as any).winners?.published),
          });
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Failed to load registrations");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [event]);

  const handleSaveResults = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${event._id}/winners`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winners: resultWinners }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save results");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  const formatRegLabel = (r: any) => {
    const isTeam = r.registrationType === "team" || Boolean(r.teamName) || Boolean(r.team?.teamName);
    const name = isTeam ? `[Team] ${r.teamName || r.team?.teamName || "Team Entry"}` : `${r.name || r.user?.firstName || "Participant"}`;
    const idSnippet = r.registrationId ? `(${r.registrationId})` : `(${r._id?.slice(-5).toUpperCase()})`;
    const extra = r.email ? `— ${r.email}` : "";
    return `${name} ${idSnippet} ${extra}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-[#0f0f0f]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <FiAward className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Manage Results &amp; Podium</h2>
              <p className="text-xs text-white/50 line-clamp-1">{event.title}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/50 font-mono text-xs">
              <FiLoader className="size-6 animate-spin text-[#FF355E]" />
              <span>Loading event participants...</span>
            </div>
          ) : (
            <>
              {/* Overall Top 3 Winners */}
              <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f0f] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                    <FiAward className="size-4 text-amber-400" /> Overall Podium (Top 3)
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    {eventRegistrations.length} Registrations Available
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* 1st Place */}
                  <div>
                    <label className="block text-amber-400 font-mono text-[11px] mb-1.5 font-bold flex items-center gap-1.5">
                      🥇 1st Place (Gold Winner)
                    </label>
                    <select
                      value={resultWinners.overall[0] || ""}
                      onChange={(e) => {
                        const copy = [...resultWinners.overall];
                        copy[0] = e.target.value;
                        setResultWinners({ ...resultWinners, overall: copy });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-amber-500/30 bg-[#141414] text-white focus:outline-none focus:border-amber-400 font-sans"
                    >
                      <option value="">-- Select 1st Place Winner --</option>
                      {eventRegistrations.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatRegLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2nd Place */}
                  <div>
                    <label className="block text-slate-300 font-mono text-[11px] mb-1.5 font-bold flex items-center gap-1.5">
                      🥈 2nd Place (Silver Winner)
                    </label>
                    <select
                      value={resultWinners.overall[1] || ""}
                      onChange={(e) => {
                        const copy = [...resultWinners.overall];
                        copy[1] = e.target.value;
                        setResultWinners({ ...resultWinners, overall: copy });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-white/20 bg-[#141414] text-white focus:outline-none focus:border-white/40 font-sans"
                    >
                      <option value="">-- Select 2nd Place Winner --</option>
                      {eventRegistrations.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatRegLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3rd Place */}
                  <div>
                    <label className="block text-amber-600 font-mono text-[11px] mb-1.5 font-bold flex items-center gap-1.5">
                      🥉 3rd Place (Bronze Winner)
                    </label>
                    <select
                      value={resultWinners.overall[2] || ""}
                      onChange={(e) => {
                        const copy = [...resultWinners.overall];
                        copy[2] = e.target.value;
                        setResultWinners({ ...resultWinners, overall: copy });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-amber-700/40 bg-[#141414] text-white focus:outline-none focus:border-amber-600 font-sans"
                    >
                      <option value="">-- Select 3rd Place Winner --</option>
                      {eventRegistrations.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatRegLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Category Winners */}
              <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f0f] space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold block border-b border-white/10 pb-3">
                  Special Recognition Categories
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-white/70 font-mono text-[11px] mb-1.5">
                      🌟 First-Year Winner
                    </label>
                    <select
                      value={resultWinners.overallFirstYear}
                      onChange={(e) => setResultWinners({ ...resultWinners, overallFirstYear: e.target.value })}
                      className="w-full h-10 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white focus:outline-none focus:border-[#FF355E] text-xs font-sans"
                    >
                      <option value="">-- Select Winner --</option>
                      {eventRegistrations.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatRegLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 font-mono text-[11px] mb-1.5">
                      🌸 First-Year Girls Winner
                    </label>
                    <select
                      value={resultWinners.overallFirstYearGirls}
                      onChange={(e) => setResultWinners({ ...resultWinners, overallFirstYearGirls: e.target.value })}
                      className="w-full h-10 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white focus:outline-none focus:border-[#FF355E] text-xs font-sans"
                    >
                      <option value="">-- Select Winner --</option>
                      {eventRegistrations.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatRegLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 font-mono text-[11px] mb-1.5">
                      👑 Overall Girls Winner
                    </label>
                    <select
                      value={resultWinners.overallGirls}
                      onChange={(e) => setResultWinners({ ...resultWinners, overallGirls: e.target.value })}
                      className="w-full h-10 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white focus:outline-none focus:border-[#FF355E] text-xs font-sans"
                    >
                      <option value="">-- Select Winner --</option>
                      {eventRegistrations.map((r) => (
                        <option key={r._id} value={r._id}>
                          {formatRegLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Categories */}
              <div className="p-5 rounded-xl border border-white/10 bg-[#0f0f0f] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                    Dynamic Custom Categories
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResultWinners({
                        ...resultWinners,
                        dynamicCategories: [
                          ...resultWinners.dynamicCategories,
                          { title: "", winners: [] },
                        ],
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF355E]/10 border border-[#FF355E]/30 text-[#FF355E] hover:bg-[#FF355E]/20 text-xs font-mono font-medium transition-all"
                  >
                    <FiPlus className="size-3" /> Add Category
                  </button>
                </div>

                {resultWinners.dynamicCategories.length === 0 ? (
                  <p className="text-xs font-mono text-white/40 italic py-2">
                    No custom dynamic categories added yet (e.g. "Best UI/UX", "Best Pitch", "Fastest Solver").
                  </p>
                ) : (
                  <div className="space-y-4">
                    {resultWinners.dynamicCategories.map((cat, catIdx) => (
                      <div key={catIdx} className="p-4 rounded-xl border border-white/10 bg-[#141414] space-y-3 relative group">
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Category title (e.g. Best UI/UX, Most Innovative)"
                            value={cat.title}
                            onChange={(e) => {
                              const copy = [...resultWinners.dynamicCategories];
                              copy[catIdx].title = e.target.value;
                              setResultWinners({ ...resultWinners, dynamicCategories: copy });
                            }}
                            className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans placeholder:text-white/30 focus:outline-none focus:border-[#FF355E]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = resultWinners.dynamicCategories.filter((_, i) => i !== catIdx);
                              setResultWinners({ ...resultWinners, dynamicCategories: copy });
                            }}
                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove Category"
                          >
                            <FiTrash2 className="size-3.5" />
                          </button>
                        </div>

                        {/* Winners inside category */}
                        <div className="space-y-2 pt-1 border-t border-white/5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                            <span>Winners ({cat.winners.length})</span>
                            <button
                              type="button"
                              onClick={() => {
                                const copy = [...resultWinners.dynamicCategories];
                                copy[catIdx].winners.push("");
                                setResultWinners({ ...resultWinners, dynamicCategories: copy });
                              }}
                              className="text-[#FF355E] hover:underline"
                            >
                              + Add Winner
                            </button>
                          </div>

                          {cat.winners.map((winnerId, wIdx) => (
                            <div key={wIdx} className="flex items-center gap-2">
                              <select
                                value={winnerId}
                                onChange={(e) => {
                                  const copy = [...resultWinners.dynamicCategories];
                                  copy[catIdx].winners[wIdx] = e.target.value;
                                  setResultWinners({ ...resultWinners, dynamicCategories: copy });
                                }}
                                className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                              >
                                <option value="">-- Select Winner --</option>
                                {eventRegistrations.map((r) => (
                                  <option key={r._id} value={r._id}>
                                    {formatRegLabel(r)}
                                  </option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = [...resultWinners.dynamicCategories];
                                  copy[catIdx].winners = copy[catIdx].winners.filter((_, i) => i !== wIdx);
                                  setResultWinners({ ...resultWinners, dynamicCategories: copy });
                                }}
                                className="p-2 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                              >
                                <FiX className="size-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#0f0f0f] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Publish Results to Public Website</h4>
                  <p className="text-xs text-white/50">
                    When enabled, podium winners and badges will be publicly visible on the event page and results board.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input
                    type="checkbox"
                    checked={resultWinners.published}
                    onChange={(e) => setResultWinners({ ...resultWinners, published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF355E]"></div>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#0f0f0f] shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-mono text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveResults}
            disabled={saving || loading}
            className="px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
          >
            {saving ? (
              <>
                <FiLoader className="size-3.5 animate-spin text-black" /> Saving Results...
              </>
            ) : (
              <>
                <FiCheck className="size-3.5" /> Save Results
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
