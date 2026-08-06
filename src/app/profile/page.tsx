"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUser, FiMail, FiPhone, FiLock, FiLogOut, FiEdit2, FiCheck,
  FiCamera, FiTrash2, FiShield, FiLoader, FiAward, FiPlus, FiX
} from "react-icons/fi";

const CATEGORY_OPTIONS = ["HACKATHONS", "GSOC", "LFX", "SIH", "ICPC", "ACM", "CP", "OTHER"];

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states for profile editing
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  // Achievements state
  const [achievements, setAchievements] = useState<any[]>([]);
  const [newAchEvent, setNewAchEvent] = useState("");
  const [newAchStatus, setNewAchStatus] = useState("");
  const [newAchCategory, setNewAchCategory] = useState("HACKATHONS");
  const [savingAch, setSavingAch] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setUsername(data.user.username || "");
        setMobile(String(data.user.mobile || ""));
        setRollNo(data.user.rollNo || "");
        setImageSrc(data.user.imageSrc || "");
        setAchievements(data.user.achievements || []);
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, WebP or GIF image formats are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      return;
    }

    setUploadingPhoto(true);
    setError(null);
    setSuccess(null);

    try {
      let finalUrl = "";
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      
      if (signRes.ok) {
        const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.secure_url) {
          finalUrl = uploadData.secure_url;
        }
      }

      if (!finalUrl) {
        const reader = new FileReader();
        finalUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const updateRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageSrc: finalUrl }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Failed to update profile picture");

      setImageSrc(finalUrl);
      setUser(updateData.user);
      setSuccess("Profile picture updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploadingPhoto(true);
      const updateRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageSrc: "" }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Failed to remove photo");

      setImageSrc("");
      setUser(updateData.user);
      setSuccess("Profile photo removed.");
    } catch (err: any) {
      setError(err.message || "Failed to remove photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          mobile: Number(mobile),
          rollNo,
          password: password ? password : undefined,
          imageSrc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setUser(data.user);
      setSuccess("Profile updated successfully!");
      setEditing(false);
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAchievement = () => {
    if (!newAchEvent.trim() || !newAchStatus.trim()) return;
    setAchievements((prev) => [
      ...prev,
      { event: newAchEvent.trim(), status: newAchStatus.trim(), category: newAchCategory },
    ]);
    setNewAchEvent("");
    setNewAchStatus("");
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveAchievements = async () => {
    setSavingAch(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/user/profile/achievements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievements }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save achievements");

      setSuccess("Achievements updated! Validated achievements are displayed on the Showcase page.");
      if (data.achievements) setAchievements(data.achievements);
    } catch (err: any) {
      setError(err.message || "Failed to save achievements");
    } finally {
      setSavingAch(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0B0D19] flex items-center justify-center text-white/50 text-xs font-mono">
        <FiLoader className="size-6 animate-spin text-[#FF355E] mr-3" /> Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-[#0B0D19] text-white pt-24 pb-16 font-sans selection:bg-[#FF355E]/30">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Hidden File Picker Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoUpload(file);
          }}
        />

        {/* Profile Header Card */}
        <div className="rounded-3xl border border-white/10 bg-[#121528] p-6 sm:p-8 shadow-2xl space-y-8 font-sans">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-5">
              
              {/* Photo Avatar Container */}
              <div className="relative group size-20 sm:size-24 rounded-2xl bg-[#FF355E]/10 border border-[#FF355E]/30 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                {uploadingPhoto ? (
                  <FiLoader className="size-6 text-[#FF355E] animate-spin" />
                ) : user.imageSrc || imageSrc ? (
                  <Image
                    src={user.imageSrc || imageSrc}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-[#FF355E] uppercase font-sans">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                )}

                {/* Upload Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider gap-1"
                >
                  <FiCamera className="size-5" />
                  <span>Change</span>
                </button>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-[#8C93B0] mt-0.5 font-sans">@{user.username}</p>
                
                {/* Photo Action Links */}
                <div className="flex items-center gap-3 mt-2 font-sans">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="text-xs font-bold text-[#FF355E] hover:underline flex items-center gap-1.5"
                  >
                    <FiCamera className="size-3.5" /> Upload Photo
                  </button>

                  {(user.imageSrc || imageSrc) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={uploadingPhoto}
                      className="text-xs font-bold text-red-400/80 hover:text-red-400 hover:underline flex items-center gap-1"
                    >
                      <FiTrash2 className="size-3" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-sans">
              {user.role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#FF355E] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#FF4D70] transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <FiLogOut className="size-3.5" /> Log Out
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
              <FiCheck className="size-4" /> {success}
            </div>
          )}

          {/* Account Details & Edit Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-sans uppercase tracking-wider flex items-center gap-2">
                <FiUser className="text-[#FF355E]" /> Personal Details
              </h2>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <FiEdit2 className="size-3.5" /> Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4 font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      placeholder="24305"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                      Profile Photo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={imageSrc}
                      onChange={(e) => setImageSrc(e.target.value)}
                      className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8C93B0] uppercase tracking-wider block mb-1">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#121528] border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#FF355E]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-[#FF355E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#FF4D70] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <FiLoader className="size-4 animate-spin" /> : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-bold uppercase hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#0B0D19] p-6 rounded-2xl border border-white/10 font-sans text-xs">
                <div>
                  <span className="text-[#8C93B0] block mb-1">Email Address</span>
                  <span className="text-white font-bold">{user.email}</span>
                </div>
                <div>
                  <span className="text-[#8C93B0] block mb-1">Roll Number</span>
                  <span className="text-white font-bold">{user.rollNo || "Not set"}</span>
                </div>
                <div>
                  <span className="text-[#8C93B0] block mb-1">Mobile Number</span>
                  <span className="text-white font-bold">{user.mobile || "Not set"}</span>
                </div>
                <div>
                  <span className="text-[#8C93B0] block mb-1">Username</span>
                  <span className="text-white font-bold">@{user.username}</span>
                </div>
                <div>
                  <span className="text-[#8C93B0] block mb-1">Account Status</span>
                  <span className="text-emerald-400 font-bold uppercase">{user.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive My Achievements Section */}
          <div className="pt-6 border-t border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-sans uppercase tracking-wider flex items-center gap-2">
                  <FiAward className="text-[#FF355E]" /> My Achievements & Milestones
                </h2>
                <p className="text-xs text-[#8C93B0] mt-0.5 font-sans">
                  Add your hackathons, open source contributions, and competitive programming achievements to be featured on the showcase page.
                </p>
              </div>

              <Link
                href="/achievements"
                className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
              >
                View Showcase
              </Link>
            </div>

            {/* List of current achievements */}
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0B0D19] border border-white/10 flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF355E]/10 border border-[#FF355E]/20 text-[#FF355E]">
                          {ach.category}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{ach.event}</h4>
                      </div>
                      <p className="text-[11px] text-[#8C93B0] truncate pl-0.5">{ach.status}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(idx)}
                      className="size-7 grid place-items-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0 ml-2"
                      title="Remove Achievement"
                    >
                      <FiTrash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#0B0D19] border border-white/10 text-center text-xs text-[#8C93B0] font-sans">
                You haven&apos;t added any achievements yet. Use the form below to add hackathon wins, GSoC, LFX, or CP ranks!
              </div>
            )}

            {/* Add New Achievement Form */}
            <div className="p-4 rounded-2xl bg-[#0B0D19] border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add Achievement</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-[#8C93B0] uppercase block mb-1">
                    Event / Hackathon Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SIH 2024 / GSoC '25"
                    value={newAchEvent}
                    onChange={(e) => setNewAchEvent(e.target.value)}
                    className="w-full bg-[#121528] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF355E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8C93B0] uppercase block mb-1">
                    Status / Rank / Org
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Winner / @Google / Candidate Master"
                    value={newAchStatus}
                    onChange={(e) => setNewAchStatus(e.target.value)}
                    className="w-full bg-[#121528] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF355E]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8C93B0] uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={newAchCategory}
                    onChange={(e) => setNewAchCategory(e.target.value)}
                    className="w-full bg-[#121528] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#FF355E]"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddAchievement}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <FiPlus className="size-4 text-[#FF355E]" /> Add to List
                </button>
              </div>
            </div>

            {/* Save Achievements Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAchievements}
                disabled={savingAch}
                className="px-6 py-3 rounded-xl bg-[#FF355E] hover:bg-[#FF4D70] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {savingAch ? <FiLoader className="size-4 animate-spin" /> : <><FiCheck className="size-4" /> Save Achievements</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
