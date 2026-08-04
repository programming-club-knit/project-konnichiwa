"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX, FiLoader, FiImage } from "react-icons/fi";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, WebP or GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Step 1: Get a server-signed signature (API secret never leaves the server)
      const signRes = await fetch("/api/upload/sign", { method: "POST" });
      if (!signRes.ok) {
        const err = await signRes.json();
        throw new Error(err.message || "Failed to get upload signature.");
      }
      const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

      // Step 2: Upload directly to Cloudinary using the signed params
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
      const data = await uploadRes.json();

      if (!uploadRes.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Upload to Cloudinary failed.");
      }

      onChange(data.secure_url);
    } catch (err: any) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleClear = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#0B0D19] group">
          <div className="relative w-full h-44">
            <Image
              src={value}
              alt="Event cover"
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-black text-xs font-mono font-semibold rounded-md hover:bg-white/90 transition-all"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 bg-red-500/80 text-white text-xs font-mono font-semibold rounded-md hover:bg-red-500 transition-all flex items-center gap-1.5"
            >
              <FiX className="size-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed
            h-40 transition-all select-none
            ${uploading ? "cursor-wait" : "cursor-pointer"}
            ${dragOver
              ? "border-white/40 bg-white/5"
              : "border-white/10 bg-[#0B0D19] hover:border-white/20 hover:bg-white/[0.02]"
            }
          `}
        >
          {uploading ? (
            <>
              <FiLoader className="size-7 animate-spin text-white/50" />
              <p className="text-xs font-mono text-white/40">Uploading securely...</p>
            </>
          ) : (
            <>
              <div className="grid size-12 place-items-center rounded-xl bg-white/5 border border-white/10">
                <FiUploadCloud className="size-6 text-white/40" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-white/70">
                  Drag & drop or <span className="text-white underline underline-offset-2">click to upload</span>
                </p>
                <p className="text-[11px] font-mono text-white/30 mt-0.5">
                  JPEG, PNG, WebP — max 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL fallback input */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30 pointer-events-none" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL directly"
            className="w-full pl-8 pr-3 py-2 bg-[#0B0D19] border border-white/10 rounded-md text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/30"
          />
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-md border border-white/10 bg-white/5 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all"
          >
            <FiX className="size-3.5" />
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] font-mono text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
