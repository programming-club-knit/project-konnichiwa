"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  FiUser, 
  FiUsers, 
  FiPhone, 
  FiMail, 
  FiHash, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPlus, 
  FiTrash2, 
  FiArrowRight, 
  FiArrowLeft, 
  FiMessageCircle, 
  FiExternalLink, 
  FiCopy, 
  FiCheck,
  FiFileText,
  FiClock,
  FiShield
} from "react-icons/fi";
import { type EventItem, getEventDynamicStatus } from "@/lib/event-status";
import { computeAcademicFromRoll } from "@/lib/academic";
import { EventCoverImage } from "@/components/events/event-cover-image";

interface EventRegistrationFormProps {
  event: EventItem;
  onSuccess?: (registration: any) => void;
}

export function EventRegistrationForm({ event, onSuccess }: EventRegistrationFormProps) {
  const isTeam = event.registrationType === "team";
  const minTeam = Math.max(1, Number(event.teamMinSize || 2));
  const maxTeam = Math.max(minTeam, Number(event.teamMaxSize || 4));

  const timing = getEventDynamicStatus(event);
  const { isRegistrationClosed, registrationDeadlineLabel } = timing;

  const [activeTab, setActiveTab] = useState<"form" | "google-form">("form");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string>("");
  const [copiedId, setCopiedId] = useState(false);

  // Individual Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    rollNo: "",
    contactNo: "",
    email: "",
  });
  const [derivedAcademic, setDerivedAcademic] = useState<{
    valid: boolean;
    year?: number;
    branch?: string;
    reason?: string;
  }>({ valid: false });
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});

  // Team Form State
  const [teamName, setTeamName] = useState("");
  const [teamDynamic, setTeamDynamic] = useState<Record<string, any>>({});
  const [participants, setParticipants] = useState<Array<{
    name: string;
    gender: string;
    rollNo: string;
    contactNo: string;
    email: string;
    year?: number;
    branch?: string;
    dynamic: Record<string, any>;
  }>>(() =>
    Array.from({ length: minTeam }).map(() => ({
      name: "",
      gender: "",
      rollNo: "",
      contactNo: "",
      email: "",
      dynamic: {},
    }))
  );
  const [leaderIndex, setLeaderIndex] = useState(0);

  // Handlers for individual form
  const handleIndividualChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);

    if (field === "rollNo") {
      const acad = computeAcademicFromRoll(value);
      if (acad.valid) {
        setDerivedAcademic({ valid: true, year: acad.year, branch: acad.branch });
      } else {
        setDerivedAcademic({ valid: false, reason: acad.reason });
      }
    }
  };

  const handleDynamicChange = (field: string, value: any) => {
    setDynamicFields((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  // Handlers for team form
  const handleParticipantChange = (index: number, field: string, value: string) => {
    setErrorMessage(null);
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
            updated.year = undefined;
            updated.branch = undefined;
          }
        }
        return updated;
      })
    );
  };

  const handleParticipantDynamicChange = (index: number, field: string, value: any) => {
    setParticipants((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, dynamic: { ...p.dynamic, [field]: value } } : p
      )
    );
  };

  const addParticipant = () => {
    if (participants.length >= maxTeam) return;
    setParticipants((prev) => [
      ...prev,
      { name: "", gender: "", rollNo: "", contactNo: "", email: "", dynamic: {} },
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Validation
  const validate = (): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isTeam) {
      if (!teamName.trim()) {
        setErrorMessage("Please enter a team name.");
        return false;
      }
      if (participants.length < minTeam || participants.length > maxTeam) {
        setErrorMessage(`Team size must be between ${minTeam} and ${maxTeam} participants.`);
        return false;
      }

      for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        const num = i + 1;
        if (!p.name.trim()) {
          setErrorMessage(`Participant #${num}: Name is required.`);
          return false;
        }
        if (!p.gender) {
          setErrorMessage(`Participant #${num}: Gender is required.`);
          return false;
        }
        if (!p.rollNo.trim()) {
          setErrorMessage(`Participant #${num}: Roll number is required.`);
          return false;
        }
        const acad = computeAcademicFromRoll(p.rollNo);
        if (!acad.valid) {
          setErrorMessage(`Participant #${num}: ${acad.reason || "Invalid roll number."}`);
          return false;
        }
        if (!p.contactNo.trim() || !phoneRegex.test(p.contactNo)) {
          setErrorMessage(`Participant #${num}: Please enter a valid 10-digit mobile number.`);
          return false;
        }
        if (!p.email.trim() || !emailRegex.test(p.email)) {
          setErrorMessage(`Participant #${num}: Please enter a valid email address.`);
          return false;
        }

        // Validate custom participant fields
        if (Array.isArray(event.participantFields)) {
          for (const f of event.participantFields) {
            if (f.required && !String(p.dynamic?.[f.name] || "").trim()) {
              setErrorMessage(`Participant #${num}: ${f.label} is required.`);
              return false;
            }
          }
        }
      }
      return true;
    }

    // Individual validation
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!formData.gender) {
      setErrorMessage("Please select your gender.");
      return false;
    }
    if (!formData.rollNo.trim()) {
      setErrorMessage("Please enter your roll number.");
      return false;
    }
    const acad = computeAcademicFromRoll(formData.rollNo);
    if (!acad.valid) {
      setErrorMessage(acad.reason || "Please enter a valid KNIT Sultanpur roll number.");
      return false;
    }
    if (!formData.contactNo.trim() || !phoneRegex.test(formData.contactNo)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Validate dynamic event fields
    if (Array.isArray(event.registrationFields)) {
      for (const f of event.registrationFields) {
        if (f.required && !String(dynamicFields[f.name] || "").trim()) {
          setErrorMessage(`Field "${f.label}" is required.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      let payload: any;
      if (isTeam) {
        payload = {
          eventId: event._id,
          team: {
            teamName,
            dynamic: teamDynamic,
          },
          participants: participants.map((p) => {
            const acad = computeAcademicFromRoll(p.rollNo);
            return {
              name: p.name.trim(),
              gender: p.gender,
              rollNo: p.rollNo.trim(),
              contactNo: p.contactNo.trim(),
              email: p.email.trim(),
              year: acad.valid ? acad.year : undefined,
              branch: acad.valid ? acad.branch : undefined,
              dynamic: p.dynamic,
            };
          }),
          leaderIndex,
        };
      } else {
        const acad = computeAcademicFromRoll(formData.rollNo);
        payload = {
          eventId: event._id,
          name: formData.name.trim(),
          gender: formData.gender,
          rollNo: formData.rollNo.trim(),
          contactNo: formData.contactNo.trim(),
          email: formData.email.trim(),
          year: acad.valid ? acad.year : undefined,
          branch: acad.valid ? acad.branch : undefined,
          ...dynamicFields,
        };
      }

      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setRegistrationId(data.registration?.registrationId || null);
      setWhatsappLink(data.whatsappGroupLink || event.whatsappGroupLink || "");
      setSubmittedData({ type: isTeam ? "team" : "individual", payload });
      setSubmitted(true);

      if (onSuccess) onSuccess(data.registration);
    } catch (err: any) {
      console.error("Event registration error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // REGISTRATION CLOSED SCREEN
  // -------------------------------------------------------------
  if (isRegistrationClosed) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#121626] border border-white/15 text-center space-y-6 shadow-2xl">
        <div className="size-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 grid place-items-center mx-auto">
          <FiAlertCircle className="size-8" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Registration Closed
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The registration window for <strong className="text-white">{event.title}</strong>{" "}
            has closed. {registrationDeadlineLabel ? `Deadline was ${registrationDeadlineLabel}.` : ""}
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/events/${event.slug || event._id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-all"
          >
            Back to Event Details
          </Link>
          {event.whatsappGroupLink && (
            <a
              href={event.whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <FiMessageCircle className="size-4" />
              <span>Join WhatsApp Group</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REGISTRATION SUCCESS SCREEN
  // -------------------------------------------------------------
  if (submitted) {
    return (
      <div className="p-6 sm:p-10 rounded-3xl bg-[#121626] border border-emerald-500/30 text-center space-y-8 shadow-2xl animate-in fade-in-50 duration-300">
        {/* Animated Check Emblem */}
        <div className="size-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 grid place-items-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          <FiCheckCircle className="size-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Entry Confirmed
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Registration Successful!
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            You are officially registered for <strong className="text-white">{event.title}</strong>.
            Please save your registration details below.
          </p>
        </div>

        {/* Unique Registration ID Badge */}
        {registrationId && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#090B14] border border-white/15 flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Registration ID
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-[#FF355E] tracking-wider">
                {registrationId}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(registrationId)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              {copiedId ? (
                <>
                  <FiCheck className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <FiCopy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Summary Breakdown Card */}
        <div className="max-w-xl mx-auto rounded-2xl bg-[#0B0D19]/80 border border-white/10 p-6 text-left space-y-4 text-xs font-sans">
          <h4 className="font-bold text-white text-sm pb-2 border-b border-white/10 flex items-center justify-between">
            <span>Submitted Information</span>
            <span className="text-xs font-normal text-slate-400 capitalize">
              {submittedData?.type} Entry
            </span>
          </h4>

          {submittedData?.type === "individual" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block">Name</span>
                <span className="text-white font-medium">{submittedData.payload.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Gender</span>
                <span className="text-white font-medium capitalize">{submittedData.payload.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Roll Number</span>
                <span className="text-white font-medium font-mono">{submittedData.payload.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Branch & Year</span>
                <span className="text-white font-medium">
                  {submittedData.payload.branch || "KNIT"} • Year {submittedData.payload.year || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Mobile</span>
                <span className="text-white font-medium font-mono">{submittedData.payload.contactNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email</span>
                <span className="text-white font-medium break-all">{submittedData.payload.email}</span>
              </div>
            </div>
          )}

          {submittedData?.type === "team" && (
            <div className="space-y-4">
              <div>
                <span className="text-slate-500 block">Team Name</span>
                <span className="text-lg font-bold text-white">{submittedData.payload.team.teamName}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-slate-400 font-semibold block">
                  Team Members ({submittedData.payload.participants.length})
                </span>
                <div className="space-y-2">
                  {submittedData.payload.participants.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-semibold text-white block">
                          {p.name} {idx === submittedData.payload.leaderIndex && "★ (Leader)"}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Roll {p.rollNo} • {p.branch || "KNIT"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{p.contactNo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20"
            >
              <FiMessageCircle className="size-4" />
              <span>Join Official WhatsApp Group</span>
            </a>
          )}
          <Link
            href={`/events/${event.slug || event._id}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-all"
          >
            Back to Event Overview
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REGISTRATION FORM
  // -------------------------------------------------------------
  return (
    <div className="rounded-3xl bg-[#121626] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-8 font-sans">
      {/* Mode Switch Tabs (Form vs External Google Form if configured) */}
      {event.googleFormLink && (
        <div className="flex p-1 rounded-2xl bg-[#090B14] border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "form"
                ? "bg-[#FF355E] text-white shadow-md shadow-[#FF355E]/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Direct PTSC Registration
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("google-form")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "google-form"
                ? "bg-[#FF355E] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>External Google Form</span>
            <FiExternalLink className="size-3.5" />
          </button>
        </div>
      )}

      {/* External Google Form Tab Content */}
      {activeTab === "google-form" && event.googleFormLink ? (
        <div className="py-10 text-center space-y-6">
          <div className="size-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 grid place-items-center mx-auto">
            <FiExternalLink className="size-7" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white">Google Forms Registration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can also complete your registration directly on Google Forms. Click the button below to open the form in a new tab.
            </p>
          </div>
          <a
            href={event.googleFormLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-lg transition-all"
          >
            <span>Open Google Form</span>
            <FiExternalLink className="size-4" />
          </a>
        </div>
      ) : (
        /* Direct Registration Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF355E] mb-1">
              <span>{isTeam ? "Team Registration" : "Individual Entry"}</span>
              <span>•</span>
              <span className="text-emerald-400">100% Free Entry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isTeam ? "Register Your Squad" : "Candidate Registration"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter official details as recorded in college records for verification.
            </p>
          </div>

          {/* Error Notification Alert */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <FiAlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* INDIVIDUAL FORM FIELDS */}
          {/* ========================================================= */}
          {!isTeam && (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-[#FF355E]">*</span>
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#FF355E] transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleIndividualChange("name", e.target.value)}
                    placeholder="e.g. Adarsh Sharma"
                    className="w-full pl-11 pr-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 focus:ring-1 focus:ring-[#FF355E]/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Gender <span className="text-[#FF355E]">*</span>
                </label>
                <div className="relative group">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#FF355E] transition-colors" />
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => handleIndividualChange("gender", e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF355E]/60 focus:ring-1 focus:ring-[#FF355E]/40 transition-all appearance-none font-sans"
                  >
                    <option value="" disabled className="bg-[#090B14] text-slate-500">
                      Select Gender
                    </option>
                    <option value="male" className="bg-[#090B14] text-white">
                      Male
                    </option>
                    <option value="female" className="bg-[#090B14] text-white">
                      Female
                    </option>
                    <option value="other" className="bg-[#090B14] text-white">
                      Other
                    </option>
                    <option value="prefer-not-to-say" className="bg-[#090B14] text-white">
                      Prefer not to say
                    </option>
                  </select>
                </div>
              </div>

              {/* Roll Number with Real-Time Academic Derivation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Roll Number <span className="text-[#FF355E]">*</span>
                </label>
                <div className="relative group">
                  <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#FF355E] transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => handleIndividualChange("rollNo", e.target.value)}
                    placeholder="e.g. 21123 or 22214"
                    maxLength={8}
                    className="w-full pl-11 pr-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 focus:ring-1 focus:ring-[#FF355E]/40 transition-all font-sans font-mono"
                  />
                </div>

                {/* Auto-derived Branch & Year indicator */}
                {formData.rollNo.trim().length > 0 && (
                  <div className="mt-2 text-xs">
                    {derivedAcademic.valid ? (
                      <div className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                        <FiCheck className="size-3.5" />
                        <span>
                          {derivedAcademic.branch} • Year {derivedAcademic.year}
                        </span>
                      </div>
                    ) : formData.rollNo.trim().length >= 5 ? (
                      <span className="text-red-400 text-[11px]">
                        {derivedAcademic.reason || "Invalid roll number."}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Number (WhatsApp) <span className="text-[#FF355E]">*</span>
                </label>
                <div className="relative group">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#FF355E] transition-colors" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.contactNo}
                    onChange={(e) => handleIndividualChange("contactNo", e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-11 pr-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 focus:ring-1 focus:ring-[#FF355E]/40 transition-all font-sans font-mono"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address <span className="text-[#FF355E]">*</span>
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#FF355E] transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleIndividualChange("email", e.target.value)}
                    placeholder="e.g. adarsh@knit.ac.in"
                    className="w-full pl-11 pr-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 focus:ring-1 focus:ring-[#FF355E]/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Dynamic Custom Fields */}
              {Array.isArray(event.registrationFields) && event.registrationFields.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Additional Event Questions
                  </h4>
                  {event.registrationFields.map((field: any) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {field.label} {field.required && <span className="text-[#FF355E]">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={dynamicFields[field.name] || ""}
                          onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                          className="w-full px-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF355E]/60 transition-all"
                        >
                          <option value="" disabled className="bg-[#090B14] text-slate-500">
                            Select {field.label}
                          </option>
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt} className="bg-[#090B14] text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          required={field.required}
                          rows={3}
                          value={dynamicFields[field.name] || ""}
                          onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label}`}
                          className="w-full px-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 transition-all resize-none font-sans"
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          required={field.required}
                          value={dynamicFields[field.name] || ""}
                          onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label}`}
                          className="w-full px-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 transition-all font-sans"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TEAM FORM FIELDS */}
          {/* ========================================================= */}
          {isTeam && (
            <div className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Team Name <span className="text-[#FF355E]">*</span>
                </label>
                <div className="relative group">
                  <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#FF355E] transition-colors" />
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => {
                      setTeamName(e.target.value);
                      setErrorMessage(null);
                    }}
                    placeholder="e.g. Byte Busters"
                    className="w-full pl-11 pr-4 py-3 bg-[#090B14] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 focus:ring-1 focus:ring-[#FF355E]/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Participants Roster */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-bold text-white">Team Roster</h3>
                    <span className="text-[11px] text-slate-400">
                      Team size requirement: {minTeam} to {maxTeam} members
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addParticipant}
                    disabled={participants.length >= maxTeam}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                  >
                    <FiPlus className="size-3.5 text-[#FF355E]" />
                    <span>Add Member</span>
                  </button>
                </div>

                {/* Participant Cards */}
                <div className="space-y-4">
                  {participants.map((p, idx) => {
                    const isLeader = idx === leaderIndex;
                    const acad = computeAcademicFromRoll(p.rollNo);

                    return (
                      <div
                        key={idx}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isLeader
                            ? "bg-[#0B0E1B] border-[#FF355E]/40 shadow-md"
                            : "bg-[#090B14] border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="size-6 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-white grid place-items-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {idx === 0 ? "Primary Team Leader" : `Member #${idx + 1}`}
                            </span>
                            {isLeader && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF355E]/20 text-[#FF7597] border border-[#FF355E]/30">
                                Contact Point
                              </span>
                            )}
                          </div>

                          {participants.length > minTeam && (
                            <button
                              type="button"
                              onClick={() => removeParticipant(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Remove Participant"
                            >
                              <FiTrash2 className="size-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Grid Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Name */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Name <span className="text-[#FF355E]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={p.name}
                              onChange={(e) => handleParticipantChange(idx, "name", e.target.value)}
                              placeholder="Full Name"
                              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 transition-all font-sans"
                            />
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Gender <span className="text-[#FF355E]">*</span>
                            </label>
                            <select
                              required
                              value={p.gender}
                              onChange={(e) => handleParticipantChange(idx, "gender", e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FF355E]/60 transition-all font-sans"
                            >
                              <option value="" disabled className="bg-[#090B14] text-slate-500">
                                Select Gender
                              </option>
                              <option value="male" className="bg-[#090B14] text-white">Male</option>
                              <option value="female" className="bg-[#090B14] text-white">Female</option>
                              <option value="other" className="bg-[#090B14] text-white">Other</option>
                            </select>
                          </div>

                          {/* Roll Number */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Roll Number <span className="text-[#FF355E]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={8}
                              value={p.rollNo}
                              onChange={(e) => handleParticipantChange(idx, "rollNo", e.target.value)}
                              placeholder="e.g. 21123"
                              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 transition-all font-mono"
                            />
                            {p.rollNo && (
                              <div className="mt-1 text-[10px]">
                                {acad.valid ? (
                                  <span className="text-emerald-400">
                                    {acad.branch} • Year {acad.year}
                                  </span>
                                ) : p.rollNo.length >= 5 ? (
                                  <span className="text-red-400">{acad.reason}</span>
                                ) : null}
                              </div>
                            )}
                          </div>

                          {/* Contact */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Mobile Number <span className="text-[#FF355E]">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={p.contactNo}
                              onChange={(e) => handleParticipantChange(idx, "contactNo", e.target.value.replace(/\D/g, ""))}
                              placeholder="10-digit mobile"
                              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 transition-all font-mono"
                            />
                          </div>

                          {/* Email */}
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Email Address <span className="text-[#FF355E]">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={p.email}
                              onChange={(e) => handleParticipantChange(idx, "email", e.target.value)}
                              placeholder="name@knit.ac.in"
                              className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#FF355E]/60 transition-all font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SUBMIT BUTTON & POLICY */}
          {/* ========================================================= */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <FiShield className="size-3.5 text-emerald-400" />
              <span>
                By submitting this form, you certify all entered details are accurate and adhere to PTSC conduct guidelines.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#FF355E] hover:bg-[#FF4D70] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#FF355E]/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="size-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <span>Complete {isTeam ? "Team Registration" : "Registration"}</span>
                  <FiArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
