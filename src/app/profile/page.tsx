"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiEdit2, FiCheck, FiLogOut, FiLoader, FiCamera, FiTrash2, FiAward } from "react-icons/fi";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states for profile editing
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [imageSrc, setImageSrc] = useState("");

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
        setImageSrc(data.user.imageSrc || "");
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle uploading or changing profile photo
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, WebP or GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5 MB.");
      return;
    }

    setError(null);
    setUploadingPhoto(true);

    try {
      let finalImageUrl = "";

      // Step 1: Request signed Cloudinary upload signature
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
          finalImageUrl = uploadData.secure_url;
        }
      }

      // Fallback: If Cloudinary isn't configured, encode as base64 data URL for profile avatar
      if (!finalImageUrl) {
        finalImageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Step 2: Save the image URL in user profile via PUT /api/user/profile
      const updateRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageSrc: finalImageUrl }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Failed to update profile photo");

      setUser(updateData.user);
      setImageSrc(finalImageUrl);
      setSuccess("Profile photo updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setError(null);
    setUploadingPhoto(true);

    try {
      const updateRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageSrc: "" }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.message || "Failed to remove photo");

      setUser(updateData.user);
      setImageSrc("");
      setSuccess("Profile photo removed!");
    } catch (err: any) {
      setError(err.message || "Failed to remove photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          mobile: Number(mobile),
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0D19] text-white flex flex-col items-center justify-center gap-3 font-sans">
        <FiLoader className="size-8 text-[#FF355E] animate-spin" />
        <p className="text-sm text-[#8C93B0]">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0D19] text-white pt-24 pb-20 selection:bg-[#FF355E]/30 font-sans">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Hidden File Input for Avatar Upload */}
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

        {/* Profile Card Header */}
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

          {/* User Account Role Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
            <div className="p-4 rounded-2xl bg-[#0B0D19] border border-white/10">
              <span className="text-[10px] font-bold text-[#8C93B0] uppercase tracking-widest block mb-1">
                Account Type
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <FiShield className="size-4 text-[#FF355E]" />
                {user.role === "admin"
                  ? "PTSC Administrator"
                  : user.email?.toLowerCase().endsWith("@knit.ac.in")
                  ? "General KNIT Student"
                  : "Executive Member"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0D19] border border-white/10">
              <span className="text-[10px] font-bold text-[#8C93B0] uppercase tracking-widest block mb-1">
                Admin Panel Access
              </span>
              <span className="text-sm font-bold">
                {user.role === "admin" ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <FiCheck className="size-4" /> Granted
                  </span>
                ) : (
                  <span className="text-white/40">Restricted (General User)</span>
                )}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0D19] border border-white/10">
              <span className="text-[10px] font-bold text-[#8C93B0] uppercase tracking-widest block mb-1">
                PTSC Post / Batch
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <FiAward className="size-4 text-[#FF355E]" />
                {user.post || (user.batch ? `Batch ${user.batch}` : "Student")}
              </span>
            </div>
          </div>

          {/* Success / Error Messages */}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-2 font-sans">
              <FiCheck className="size-4" /> {success}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-sans">
              {error}
            </div>
          )}

          {/* Profile Details & Edit Section */}
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">Personal Details</h2>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <FiEdit2 className="size-3.5" /> Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-4 bg-[#0B0D19] p-6 rounded-2xl border border-white/10 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#0B0D19] p-6 rounded-2xl border border-white/10 font-sans text-xs">
                <div>
                  <span className="text-[#8C93B0] block mb-1">Email Address</span>
                  <span className="text-white font-bold">{user.email}</span>
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
        </div>
      </div>
    </div>
  );
}
