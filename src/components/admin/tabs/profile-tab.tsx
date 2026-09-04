"use client";

import React from 'react';
import { UserType } from '../types';

interface ProfileTabProps {
  adminUser: UserType | null;
}

export function ProfileTab({ adminUser }: ProfileTabProps) {
  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Administrator Profile</h1>
        <p className="text-xs text-white/50 mt-0.5">Your authenticated administrator account credentials.</p>
      </div>

      <div className="p-6 border border-white/10 rounded-xl bg-[#0E101A] space-y-4 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-white/10">
          <div className="size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-mono text-base font-bold text-white uppercase">
            {adminUser?.firstName?.[0] || 'A'}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{adminUser?.firstName} {adminUser?.lastName}</h2>
            <p className="text-xs font-mono text-white/50">@{adminUser?.username}</p>
          </div>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-white/50 font-mono text-[11px]">Email Address</span>
            <span className="text-white font-medium">{adminUser?.email}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-white/50 font-mono text-[11px]">System Role</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 uppercase">
              {adminUser?.role}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-white/50 font-mono text-[11px]">Account Status</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/15 bg-white/5 text-white/80 uppercase">
              {adminUser?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
