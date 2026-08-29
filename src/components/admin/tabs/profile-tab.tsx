"use client";

import React from 'react';
import { FiShield, FiUser, FiMail, FiCheck } from 'react-icons/fi';
import { UserType } from '../types';

interface ProfileTabProps {
  adminUser: UserType | null;
}

export function ProfileTab({ adminUser }: ProfileTabProps) {
  return (
    <div className="space-y-6 max-w-xl font-sans">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Administrator Account</h1>
        <p className="text-xs text-slate-400 mt-0.5">Your authenticated administrator profile and security credentials.</p>
      </div>

      <div className="p-6 border border-white/10 rounded-lg bg-[#121626] space-y-5">
        <div className="flex items-center gap-3.5 pb-4 border-b border-white/10">
          <div className="size-11 rounded-md bg-white/10 border border-white/15 flex items-center justify-center font-mono text-sm font-bold text-white uppercase">
            {adminUser?.firstName?.[0] || 'A'}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{adminUser?.firstName} {adminUser?.lastName}</h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">@{adminUser?.username}</p>
          </div>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-slate-400">Email Address</span>
            <span className="text-white font-mono text-xs">{adminUser?.email}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-slate-400">Access Role</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono border border-emerald-500/20 bg-emerald-950/40 text-emerald-400 uppercase">
              {adminUser?.role}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">Account Status</span>
            <span className="px-2 py-0.5 rounded text-xs font-mono border border-white/10 bg-white/5 text-slate-300 uppercase">
              {adminUser?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
