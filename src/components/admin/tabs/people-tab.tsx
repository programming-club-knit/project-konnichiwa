"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiLoader, FiCheck, FiRefreshCw, FiArrowLeft, FiUser, FiGithub, FiLinkedin } from "react-icons/fi";
import { ImageUpload } from "@/components/admin/image-upload";

export type PersonMember = {
  _id?: string;
  id?: string;
  name: string;
  batch: string;
  company: string;
  role: string;
  domain: string;
  imageSrc: string;
  github?: string;
  linkedin?: string;
  isPTSCAlumni?: boolean;
  order?: number;
};

export function formatBatchYear(batchInput: string | number | undefined | null): string {
  if (!batchInput) return "Other";
  const str = String(batchInput).trim();
  if (!str) return "Other";
  if (str.startsWith("Batch of")) return str;
  if (str.toLowerCase() === "other") return "Other";
  
  const num = parseInt(str.replace(/\D/g, ""), 10);
  if (!isNaN(num) && num > 1900 && num < 2100) {
    const shortYear = String(num).slice(-2);
    return `Batch of '${shortYear}`;
  }
  return "Other";
}

export function PeopleTab() {
  const [people, setPeople] = useState<PersonMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Form Mode: 'list' (people directory page) vs 'form' (landscape add/edit page)
  const [formMode, setFormMode] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [form, setForm] = useState({
    name: "",
    batch: "",
    company: "",
    role: "",
    domain: "",
    imageSrc: "",
    github: "",
    linkedin: "",
    isPTSCAlumni: true,
    order: 0,
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchPeople = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/people");
      const data = await res.json();
      if (data.success) {
        setPeople(data.people || []);
      } else {
        setError(data.message || "Failed to load people.");
      }
    } catch {
      setError("Error loading people members.");
    } finally {
      setLoading(false);
    }
  };

  const hasFetchedRef = React.useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchPeople();
  }, []);

  const handleSeed = async () => {
    if (!confirm("Seed default alumni / people members into database?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/people", { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchPeople();
      } else {
        alert(data.message || "Seeding failed");
      }
    } catch {
      alert("Error seeding data.");
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: "",
      batch: "",
      company: "",
      role: "",
      domain: "",
      imageSrc: "",
      github: "",
      linkedin: "",
      isPTSCAlumni: true,
      order: people.length + 1,
    });
    setFormMode("form");
  };

  const handleOpenEdit = (p: PersonMember) => {
    setEditingId(p._id || p.id || null);
    
    // Extract numeric 4-digit year if batch string is formatted like "Batch of '21"
    let yearVal = p.batch || "";
    const match = yearVal.match(/(\d{2,4})/);
    if (match) {
      const digits = match[1];
      yearVal = digits.length === 2 ? `20${digits}` : digits;
    } else if (yearVal.toLowerCase() === "other") {
      yearVal = "";
    }

    setForm({
      name: p.name || "",
      batch: yearVal,
      company: p.company || "",
      role: p.role || "",
      domain: p.domain || "",
      imageSrc: p.imageSrc || "",
      github: p.github || "",
      linkedin: p.linkedin || "",
      isPTSCAlumni: p.isPTSCAlumni !== false,
      order: p.order ?? 0,
    });
    setFormMode("form");
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`/api/admin/people/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Member deleted successfully!");
        setPeople((prev) => prev.filter((item) => (item._id || item.id) !== id));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting member");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formattedBatch = formatBatchYear(form.batch);
    const payload = {
      ...form,
      batch: formattedBatch,
    };

    const url = editingId ? `/api/admin/people/${editingId}` : "/api/admin/people";
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save member");

      showToast(editingId ? "Member updated successfully!" : "Member created successfully!");
      setFormMode("list");
      fetchPeople();
    } catch (err: any) {
      alert(err.message || "Error saving member");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPeople = people.filter((p) => {
    const formatted = formatBatchYear(p.batch);
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());

    const matchesBatch = selectedBatch === "all" || formatted === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const uniqueBatches = Array.from(new Set(people.map((p) => formatBatchYear(p.batch))));

  // Render Full Landscape Add/Edit Page View
  if (formMode === "form") {
    const splitName = form.name ? form.name.split(" ") : ["First", "Last"];
    const firstName = splitName[0] || "First";
    const lastName = splitName.slice(1).join(" ") || "Last";
    const previewBatch = formatBatchYear(form.batch);

    return (
      <div className="space-y-6 font-sans">
        {/* Back to Directory Button */}
        <div>
          <button
            type="button"
            onClick={() => setFormMode("list")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold tracking-wide transition-all group"
          >
            <FiArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Alumni Directory
          </button>
        </div>

        {/* Main Landscape Card: Horizontal Layout on Desktop (lg:flex-row) */}
        <div className="rounded-lg border border-white/10 bg-[#121626] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch font-sans">
          
          {/* Left Column: Branding & Poster Card Live Preview */}
          <div className="flex-1 flex flex-col justify-between space-y-5 lg:border-r lg:border-white/10 lg:pr-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                <FiUser className="size-3" />
                Alumni Manager
              </div>

              <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                {editingId ? "Edit Alumni Profile" : "Register New Alumni"}
              </h1>

              <p className="text-xs text-slate-400 leading-relaxed">
                Add distinguished KNIT alumni and club seniors to be featured on the showcase page. Graduation year is optional — leaving it empty categorizes them into <strong className="text-white">&quot;Other&quot;</strong>.
              </p>
            </div>

            {/* Live Poster Card Preview */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Live Preview Card
              </span>
              <div className="relative overflow-hidden rounded-md bg-[#090B14] border border-white/10 aspect-[3/4] max-w-xs mx-auto lg:mx-0 flex flex-col justify-between">
                {form.imageSrc ? (
                  <Image
                    src={form.imageSrc}
                    alt={form.name || "Preview"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#090B14] flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
                    <FiUser className="size-10 mb-2" />
                    <span>No Photo Uploaded</span>
                  </div>
                )}

                {/* Dark overlay without gradient */}
                <div className="absolute inset-0 bg-[#090B14]/75" />

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                    {form.isPTSCAlumni ? "PTSC ALUMNI" : "ALUMNI"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {previewBatch}
                  </span>
                </div>

                <div className="relative z-10 p-4 mt-auto flex flex-col">
                  <div className="mb-1.5">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {firstName} {lastName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300">
                    {form.role || "Job Role"}
                  </p>
                  <p className="text-xs font-medium text-emerald-400 mt-0.5">
                    {form.company || "Company / Organization"}
                  </p>

                  <div className="mt-2.5 pt-2 flex items-center gap-3 border-t border-white/10 text-[10px] text-slate-400 font-mono">
                    {form.github && <span className="flex items-center gap-1"><FiGithub className="size-3" /> GitHub</span>}
                    {form.linkedin && <span className="flex items-center gap-1"><FiLinkedin className="size-3" /> LinkedIn</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Inputs */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aseem Srivastava"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Graduation Year <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min={1950}
                    max={2100}
                    placeholder="e.g. 2021"
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Company / Org *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google / Microsoft"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Domain / Field *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems"
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Profile Photo Upload
                </label>
                <ImageUpload
                  value={form.imageSrc}
                  onChange={(url) => setForm({ ...form, imageSrc: url })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    className="w-full bg-[#090B14] border border-white/15 rounded-md py-2.5 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2.5 px-3.5 rounded-md bg-[#090B14] border border-white/10">
                <input
                  type="checkbox"
                  id="isPTSCAlumni"
                  checked={form.isPTSCAlumni}
                  onChange={(e) => setForm({ ...form, isPTSCAlumni: e.target.checked })}
                  className="size-4 rounded bg-[#121626] border-white/20 accent-white cursor-pointer"
                />
                <label htmlFor="isPTSCAlumni" className="text-xs font-medium text-white cursor-pointer select-none">
                  PTSC Alumni Member?{" "}
                  <span className="text-slate-400 font-normal text-[11px]">
                    (Tag: {form.isPTSCAlumni ? "PTSC ALUMNI" : "ALUMNI"})
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFormMode("list")}
                  className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-md bg-white text-black text-xs font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {submitting ? <FiLoader className="size-3.5 animate-spin" /> : null}
                  {editingId ? "Save Changes" : "Create Alumni Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render Directory List View
  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-[#13172B] text-white text-sm font-semibold rounded-md border border-emerald-500/30 shadow-xl flex items-center gap-3">
          <div className="size-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <FiCheck className="size-3.5" />
          </div>
          <span>{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Our People / Alumni Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage alumni profiles, company achievements, and mentors showcased on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="px-3.5 py-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={`size-3.5 ${seeding ? "animate-spin" : ""}`} /> Seed Defaults
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-md bg-white text-black hover:bg-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <FiPlus className="size-3.5" /> Add Member
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <FiSearch className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search alumni by name, company, role, domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121626] border border-white/10 rounded-md py-1.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30"
          />
        </div>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="w-full sm:w-48 bg-[#121626] border border-white/10 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-white/30"
        >
          <option value="all">All Batches ({people.length})</option>
          {uniqueBatches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Table / Grid Content */}
      {loading ? (
        <div className="p-16 text-center border border-white/10 rounded-lg bg-[#121626] text-slate-400 text-xs font-sans flex items-center justify-center gap-2">
          <FiLoader className="size-4 animate-spin text-white/60" /> Loading alumni records...
        </div>
      ) : error ? (
        <div className="p-4 text-center border border-red-500/20 bg-red-500/10 rounded-md text-red-300 text-xs">
          {error}
        </div>
      ) : filteredPeople.length === 0 ? (
        <div className="p-16 text-center border border-white/10 rounded-lg bg-[#121626] text-slate-400 text-xs space-y-3">
          <p>No alumni members found.</p>
          <button
            type="button"
            onClick={handleSeed}
            className="px-3.5 py-1.5 rounded-md bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-all"
          >
            Seed Default Alumni Data
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person) => (
            <div
              key={person._id || person.id}
              className="p-4 rounded-lg border border-white/10 bg-[#121626] hover:border-white/20 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="relative size-12 rounded-md overflow-hidden border border-white/10 shrink-0 bg-white/5">
                  <Image
                    src={person.imageSrc || "/teams/default-avatar.png"}
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 text-slate-300">
                      {formatBatchYear(person.batch)}
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 text-slate-400">
                      {person.isPTSCAlumni !== false ? "PTSC ALUMNI" : "ALUMNI"}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white truncate">{person.name}</h3>
                  <p className="text-xs text-emerald-400 font-medium truncate">{person.company}</p>
                  <p className="text-[11px] text-slate-400 truncate">{person.role}</p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider truncate max-w-[140px]">
                  {person.domain}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(person)}
                    className="size-7 grid place-items-center rounded bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Edit Member"
                  >
                    <FiEdit2 className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(person._id || person.id)}
                    className="size-7 grid place-items-center rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete Member"
                  >
                    <FiTrash2 className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
