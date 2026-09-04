"use client";

import React from 'react';
import { FiUsers, FiUserCheck, FiCalendar, FiPlus, FiArrowRight } from 'react-icons/fi';
import { UserType } from '../types';

interface OverviewTabProps {
  adminUser: UserType | null;
  allUsersCount: number;
  pendingUsersCount: number;
  eventsCount: number;
  onNavigateToUsers: () => void;
  onNavigateToNewEvent: () => void;
}

export function OverviewTab({
  adminUser,
  allUsersCount,
  pendingUsersCount,
  eventsCount,
  onNavigateToUsers,
  onNavigateToNewEvent,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-xs text-white/50 mt-1">Welcome back, {adminUser?.firstName || 'Admin'}. Here is your system activity summary.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-[#0E101A] border border-white/10 rounded-xl space-y-3 shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Registered Users</span>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70">
              <FiUsers className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-white">{allUsersCount}</span>
            <span className="text-[11px] font-mono text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </div>

        <div className="p-5 bg-[#0E101A] border border-white/10 rounded-xl space-y-3 shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Pending Approvals</span>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70">
              <FiUserCheck className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-white">{pendingUsersCount}</span>
            {pendingUsersCount > 0 ? (
              <span className="text-[11px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Action Req.
              </span>
            ) : (
              <span className="text-[11px] font-mono text-white/40 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                All Clear
              </span>
            )}
          </div>
        </div>

        <div className="p-5 bg-[#0E101A] border border-white/10 rounded-xl space-y-3 shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Total Events</span>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70">
              <FiCalendar className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-white">{eventsCount}</span>
            <span className="text-[11px] font-mono text-white/50 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
              Published
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="p-5 bg-[#0E101A] border border-white/10 rounded-xl space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
          <p className="text-xs text-white/40 mt-0.5">Shortcuts for common admin management tasks.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onNavigateToUsers}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2"
          >
            Manage Users & Roles <FiArrowRight className="size-3.5" />
          </button>

          <button
            onClick={onNavigateToNewEvent}
            className="px-4 py-2.5 bg-white text-black hover:bg-white/90 text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <FiPlus className="size-3.5" /> Create New Event
          </button>
        </div>
      </div>
    </div>
  );
}
