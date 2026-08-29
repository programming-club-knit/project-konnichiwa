"use client";

import React from 'react';
import { FiUsers, FiUserCheck, FiCalendar, FiPlus, FiArrowRight, FiActivity, FiShield } from 'react-icons/fi';
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
    <div className="space-y-6 font-sans">
      {/* Tab Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-white font-medium">{adminUser?.firstName} {adminUser?.lastName}</span> ({adminUser?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToNewEvent}
            className="px-3.5 py-2 bg-white text-black hover:bg-slate-200 rounded-md text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2"
          >
            <FiPlus className="size-3.5" /> Create Event
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Users Metric Card */}
        <div className="p-5 bg-[#121626] border border-white/10 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Members
            </span>
            <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-300">
              <FiUsers className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-bold text-white tracking-tight font-mono">
              {allUsersCount}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Registered accounts and student profiles.
          </p>
        </div>

        {/* Pending Approvals Metric Card */}
        <div className="p-5 bg-[#121626] border border-white/10 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-300">
              <FiUserCheck className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-bold text-white tracking-tight font-mono">
              {pendingUsersCount}
            </span>
            {pendingUsersCount > 0 ? (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-400">
                Action Req.
              </span>
            ) : (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                Clear
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Membership requests waiting for review.
          </p>
        </div>

        {/* Published Events Metric Card */}
        <div className="p-5 bg-[#121626] border border-white/10 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Events
            </span>
            <div className="p-2 rounded bg-white/5 border border-white/10 text-slate-300">
              <FiCalendar className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-bold text-white tracking-tight font-mono">
              {eventsCount}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              Published
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Scheduled workshops, hackathons and contests.
          </p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="p-5 bg-[#121626] border border-white/10 rounded-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Quick Actions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Shortcuts for administrative workflows.</p>
          </div>
          <div className="size-7 rounded bg-white/5 flex items-center justify-center text-slate-400">
            <FiActivity className="size-3.5" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={onNavigateToUsers}
            className="flex items-center justify-between p-3.5 rounded-md bg-[#090B14] border border-white/10 hover:border-white/20 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center shrink-0">
                <FiShield className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-slate-200">
                  Manage Users & Roles
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Approve signups, assign posts, or update permissions.
                </p>
              </div>
            </div>
            <FiArrowRight className="size-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          <button
            onClick={onNavigateToNewEvent}
            className="flex items-center justify-between p-3.5 rounded-md bg-[#090B14] border border-white/10 hover:border-white/20 text-left transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center shrink-0">
                <FiPlus className="size-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-slate-200">
                  Publish New Event
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Set up registration forms, dates, and rulebooks.
                </p>
              </div>
            </div>
            <FiArrowRight className="size-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
