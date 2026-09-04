"use client";

import React, { useState, useEffect } from "react";
import { 
  FiX, 
  FiUser, 
  FiPhone, 
  FiHash, 
  FiMail, 
  FiUsers, 
  FiTrash2, 
  FiPlus, 
  FiCheck, 
  FiLoader,
  FiAward
} from "react-icons/fi";
import { computeAcademicFromRoll } from "@/lib/academic";
import { EventType } from "../types";

interface EditRegistrationModalProps {
  registration: any;
  event?: EventType | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRegistrationModal({
  registration,
  event,
  onClose,
  onSuccess,
}: EditRegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTeam = registration.type === "team" || Boolean(registration.team?.teamName) || Boolean(registration.teamName);

  // Individual form state
  const [formData, setFormData] = useState({
    name: registration.name || registration.user?.firstName || "",
    gender: registration.gender || "",
    rollNo: registration.rollNo || "",
    contactNo: registration.contactNo || registration.mobile || "",
    email: registration.email || registration.user?.email || "",
  });
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>(registration.dynamic || {});
  const [derivedAcademic, setDerivedAcademic] = useState<any>({ valid: false });

  // Team form state
  const [teamData, setTeamData] = useState({
    teamName: registration.team?.teamName || registration.teamName || registration.name || "",
    dynamic: registration.team?.dynamic || {},
  });

  const [participants, setParticipants] = useState<any[]>(
    Array.isArray(registration.participants) && registration.participants.length > 0
      ? registration.participants.map((p: any) => ({
          name: p.name || "",
          gender: p.gender || "",
          rollNo: p.rollNo || "",
          contactNo: p.contactNo || p.mobile || "",
          email: p.email || "",
          dynamic: p.dynamic || {},
          year: p.year,
          branch: p.branch,
        }))
      : [
          {
            name: registration.teamLeaderName || registration.name || "",
            gender: registration.gender || "",
            rollNo: registration.rollNo || "",
            contactNo: registration.contactNo || registration.mobile || "",
            email: registration.email || "",
            dynamic: {},
            year: null,
            branch: "",
          },
        ]
  );

  const [leaderIndex, setLeaderIndex] = useState<number>(registration.leaderIndex || 0);

  const minTeam = event ? Math.max(1, Number(event.teamMinSize || 1)) : 1;
  const maxTeam = event ? Math.max(minTeam, Number(event.teamMaxSize || minTeam)) : 6;

  useEffect(() => {
    if (!isTeam && formData.rollNo) {
      const acad = computeAcademicFromRoll(formData.rollNo);
      setDerivedAcademic(acad);
    }
  }, [formData.rollNo, isTeam]);

  const handleParticipantChange = (index: number, field: string, value: any) => {
    setParticipants((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        const updated = { ...p, [field]: value };
        if (field === "rollNo") {
          const acad = computeAcademicFromRoll(value);
          if (acad.valid) {
            updated.year = acad.year;
            updated.branch = acad.branch;
          } else {
            updated.year = null;
            updated.branch = "";
          }
        }
        return updated;
      })
    );
  };

  const addParticipant = () => {
    if (participants.length >= maxTeam) return;
    setParticipants((prev) => [
      ...prev,
      {
        name: "",
        gender: "",
        rollNo: "",
        contactNo: "",
        email: "",
        dynamic: {},
        year: null,
        branch: "",
      },
    ]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length <= minTeam) return;
    setParticipants((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (leaderIndex >= filtered.length) setLeaderIndex(0);
      return filtered;
    });
  };

  const validate = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (isTeam) {
      if (!teamData.teamName.trim()) {
        setError("Team name is required");
        return false;
      }
      if (participants.length < minTeam || participants.length > maxTeam) {
        setError(`Team must have between ${minTeam} and ${maxTeam} participants`);
        return false;
      }
      for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        if (!p.name.trim() || !p.gender || !p.rollNo.trim() || !p.contactNo.trim() || !p.email.trim()) {
          setError(`Participant #${i + 1} is missing required fields`);
          return false;
        }
        if (!phoneRegex.test(String(p.contactNo).trim())) {
          setError(`Participant #${i + 1} must have a valid 10-digit phone number`);
          return false;
        }
        const acad = computeAcademicFromRoll(p.rollNo);
        if (!acad.valid) {
          setError(`Participant #${i + 1}: ${acad.reason}`);
          return false;
        }
      }
      return true;
    }

    // Individual
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.gender) {
      setError("Gender is required");
      return false;
    }
    if (!formData.rollNo.trim()) {
      setError("Roll Number is required");
      return false;
    }
    if (!formData.contactNo.trim() || !phoneRegex.test(formData.contactNo.trim())) {
      setError("Valid 10-digit Contact Number is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    const acad = computeAcademicFromRoll(formData.rollNo);
    if (!acad.valid) {
      setError(acad.reason || "Invalid roll number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    try {
      setLoading(true);
      let payload: any;
      if (isTeam) {
        payload = {
          team: {
            teamName: teamData.teamName,
            dynamic: teamData.dynamic,
          },
          participants: participants.map((p) => ({
            name: p.name,
            gender: p.gender,
            rollNo: p.rollNo,
            contactNo: p.contactNo,
            email: p.email,
            dynamic: p.dynamic,
            year: p.year,
            branch: p.branch,
          })),
          leaderIndex,
        };
      } else {
        payload = {
          name: formData.name,
          gender: formData.gender,
          rollNo: formData.rollNo,
          contactNo: formData.contactNo,
          email: formData.email,
          dynamic: dynamicFields,
        };
      }

      const res = await fetch(`/api/registrations/${registration._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update registration");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-[#0f0f0f]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {isTeam ? <FiUsers className="size-5 text-blue-400" /> : <FiUser className="size-5 text-[#FF355E]" />}
              Edit Registration: {registration.registrationId || registration._id?.slice(-6).toUpperCase()}
            </h2>
            <p className="text-xs text-white/50 mt-0.5">
              {event?.title ? `Event: ${event.title}` : "Manage participant details and dynamic custom answers."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {!isTeam ? (
            /* Individual Registration Form */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-3 size-4 text-white/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                    required
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                    Roll Number *
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3.5 top-3 size-4 text-white/40" />
                    <input
                      type="text"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                      placeholder="e.g. 23404"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                      required
                    />
                  </div>
                  {derivedAcademic.valid && (
                    <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                      Year {derivedAcademic.year} • {derivedAcademic.branch}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-3 size-4 text-white/40" />
                    <input
                      type="text"
                      value={formData.contactNo}
                      onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-3 size-4 text-white/40" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Fields */}
              {Object.keys(dynamicFields).length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 font-semibold">
                    Custom Registration Answers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(dynamicFields).map(([k, v]) => (
                      <div key={k}>
                        <label className="block text-xs font-mono text-white/70 mb-1 capitalize">{k}</label>
                        <input
                          type="text"
                          value={String(v ?? "")}
                          onChange={(e) => setDynamicFields({ ...dynamicFields, [k]: e.target.value })}
                          className="w-full h-9 px-3 rounded-lg border border-white/10 bg-[#0f0f0f] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Team Registration Form */
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0f0f0f] space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5 font-semibold">
                    Team Name *
                  </label>
                  <div className="relative">
                    <FiUsers className="absolute left-3.5 top-3 size-4 text-blue-400" />
                    <input
                      type="text"
                      value={teamData.teamName}
                      onChange={(e) => setTeamData({ ...teamData, teamName: e.target.value })}
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                      required
                    />
                  </div>
                </div>

                {/* Team Dynamic Fields */}
                {Object.keys(teamData.dynamic).length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <p className="text-xs font-mono uppercase text-white/50">Team-Level Answers</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(teamData.dynamic).map(([k, v]) => (
                        <div key={k}>
                          <label className="block text-xs font-mono text-white/70 mb-1 capitalize">{k}</label>
                          <input
                            type="text"
                            value={String(v ?? "")}
                            onChange={(e) =>
                              setTeamData({
                                ...teamData,
                                dynamic: { ...teamData.dynamic, [k]: e.target.value },
                              })
                            }
                            className="w-full h-9 px-3 rounded-lg border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Team Participants List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-2">
                    <FiUsers className="size-4 text-emerald-400" />
                    Team Members ({participants.length}/{maxTeam})
                  </h3>
                  {participants.length < maxTeam && (
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-mono transition-all"
                    >
                      <FiPlus className="size-3" /> Add Member
                    </button>
                  )}
                </div>

                {participants.map((p, idx) => {
                  const isLeader = leaderIndex === idx;
                  const acad = computeAcademicFromRoll(p.rollNo);

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-3 relative transition-all ${
                        isLeader
                          ? "border-[#FF355E]/40 bg-[#FF355E]/5"
                          : "border-white/10 bg-[#0f0f0f]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setLeaderIndex(idx)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                              isLeader
                                ? "bg-[#FF355E] text-white font-bold"
                                : "bg-white/10 text-white/60 hover:text-white"
                            }`}
                          >
                            <FiAward className="size-3.5" />
                            {isLeader ? "Team Leader" : "Make Leader"}
                          </button>
                          <span className="text-xs font-mono text-white/50">
                            Member #{idx + 1}
                          </span>
                        </div>

                        {participants.length > minTeam && (
                          <button
                            type="button"
                            onClick={() => removeParticipant(idx)}
                            className="p-1.5 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                            title="Remove Member"
                          >
                            <FiTrash2 className="size-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">Name *</label>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handleParticipantChange(idx, "name", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">Gender *</label>
                          <select
                            value={p.gender}
                            onChange={(e) => handleParticipantChange(idx, "gender", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                            required
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">Roll No *</label>
                          <input
                            type="text"
                            value={p.rollNo}
                            onChange={(e) => handleParticipantChange(idx, "rollNo", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                            required
                          />
                          {acad.valid && (
                            <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                              Yr {acad.year} • {acad.branch.slice(0, 15)}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-white/60 mb-1">Contact No *</label>
                          <input
                            type="text"
                            value={p.contactNo}
                            onChange={(e) => handleParticipantChange(idx, "contactNo", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono text-white/60 mb-1">Email *</label>
                          <input
                            type="email"
                            value={p.email}
                            onChange={(e) => handleParticipantChange(idx, "email", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                            required
                          />
                        </div>
                      </div>

                      {/* Participant Dynamic fields */}
                      {p.dynamic && Object.keys(p.dynamic).length > 0 && (
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <p className="text-[10px] font-mono text-white/40 uppercase">Member Answers</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(p.dynamic).map(([k, v]) => (
                              <div key={k}>
                                <label className="block text-[10px] font-mono text-white/60 capitalize mb-0.5">{k}</label>
                                <input
                                  type="text"
                                  value={String(v ?? "")}
                                  onChange={(e) => {
                                    const nextDyn = { ...p.dynamic, [k]: e.target.value };
                                    handleParticipantChange(idx, "dynamic", nextDyn);
                                  }}
                                  className="w-full h-7 px-2 rounded border border-white/10 bg-[#141414] text-white text-xs font-sans focus:outline-none focus:border-[#FF355E]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-mono text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <FiLoader className="size-3.5 animate-spin text-black" /> Saving...
                </>
              ) : (
                <>
                  <FiCheck className="size-3.5" /> Save Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
