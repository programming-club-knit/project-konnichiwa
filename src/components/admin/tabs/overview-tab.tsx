"use client";

import React, { memo } from 'react';
import { 
  FiUsers, 
  FiUserCheck, 
  FiCalendar, 
  FiPlus, 
  FiArrowRight, 
  FiActivity, 
  FiShield,
  FiMail,
  FiAward
} from 'react-icons/fi';
import { UserType } from '../types';
import { AdminPageHeader, AdminMetricCard, AdminCard } from '../ui';

interface OverviewTabProps {
  adminUser: UserType | null;
  allUsersCount: number;
  pendingUsersCount: number;
  eventsCount: number;
  onNavigateToUsers: () => void;
  onNavigateToNewEvent: () => void;
  onNavigateToEvents?: () => void;
  onNavigateToMail?: () => void;
}

export const OverviewTab = memo(function OverviewTab({
  adminUser,
  allUsersCount,
  pendingUsersCount,
  eventsCount,
  onNavigateToUsers,
  onNavigateToNewEvent,
  onNavigateToEvents,
  onNavigateToMail,
}: OverviewTabProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* Tab Header Banner */}
      <AdminPageHeader
        title="Dashboard Overview"
        description={
          <span>
            Logged in as <span className="text-white font-medium">{adminUser?.firstName} {adminUser?.lastName}</span> ({adminUser?.email})
          </span>
        }
        actions={
          <button
            onClick={onNavigateToNewEvent}
            className="px-3.5 py-2 bg-white text-black hover:bg-slate-200 rounded-md text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2"
          >
            <FiPlus className="size-3.5" /> Create Event
          </button>
        }
      />

      {/* Metrics Grid using Reusable AdminMetricCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminMetricCard
          title="Total Members"
          value={allUsersCount}
          icon={<FiUsers className="size-4" />}
          badgeText="Active"
          badgeVariant="success"
          description="Registered student accounts and verified members."
          onClick={onNavigateToUsers}
        />

        <AdminMetricCard
          title="Pending Approvals"
          value={pendingUsersCount}
          icon={<FiUserCheck className="size-4" />}
          badgeText={pendingUsersCount > 0 ? "Action Req." : "Clear"}
          badgeVariant={pendingUsersCount > 0 ? "warning" : "default"}
          description="Membership requests waiting for review."
          onClick={onNavigateToUsers}
        />

        <AdminMetricCard
          title="Total Events"
          value={eventsCount}
          icon={<FiCalendar className="size-4" />}
          badgeText="Published"
          badgeVariant="default"
          description="Scheduled workshops, hackathons and contests."
          onClick={onNavigateToEvents}
        />
      </div>

      {/* Quick Action Hub using Reusable AdminCard */}
      <AdminCard
        title="Quick Actions"
        subtitle="Shortcuts for essential administrative workflows."
        icon={<FiActivity className="size-3.5" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

          {onNavigateToMail && (
            <button
              onClick={onNavigateToMail}
              className="flex items-center justify-between p-3.5 rounded-md bg-[#090B14] border border-white/10 hover:border-white/20 text-left transition-all group col-span-1 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3">
                <div className="size-8 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center shrink-0">
                  <FiMail className="size-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white group-hover:text-slate-200">
                    Mail & Certificates
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dispatch event participation emails and updates.
                  </p>
                </div>
              </div>
              <FiArrowRight className="size-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          )}
        </div>
      </AdminCard>
    </div>
  );
});
