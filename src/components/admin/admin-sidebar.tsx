"use client";

import React from 'react';
import Image from 'next/image';
import { 
  FiGrid, 
  FiCalendar, 
  FiList, 
  FiCheckSquare, 
  FiMail, 
  FiUsers, 
  FiUser, 
  FiLogOut 
} from 'react-icons/fi';
import { UserType } from './types';

type TabType = 'overview' | 'events' | 'registrations' | 'attendance' | 'mail' | 'users' | 'profile';

interface AdminSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingCount: number;
  adminUser: UserType | null;
  onLogout: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingCount,
  adminUser,
  onLogout,
}: AdminSidebarProps) {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <FiGrid className="size-4" /> },
    { id: 'events', label: 'Events', icon: <FiCalendar className="size-4" /> },
    { id: 'registrations', label: 'Registrations', icon: <FiList className="size-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <FiCheckSquare className="size-4" /> },
    { id: 'mail', label: 'Mail Manager', icon: <FiMail className="size-4" /> },
    { id: 'users', label: 'Users & Roles', icon: <FiUsers className="size-4" />, badge: pendingCount },
    { id: 'profile', label: 'Profile', icon: <FiUser className="size-4" /> },
  ];

  return (
    <aside className="w-56 border-r border-white/10 bg-[#0E101A] flex flex-col justify-between p-4 shrink-0 selection:bg-white/20">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 px-1">
          <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
            <Image
              src="/logo.png"
              alt="PTSC logo"
              width={24}
              height={24}
              className="size-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white tracking-tight">
              PTSC Admin
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Console
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold border border-white/15 shadow-sm'
                    : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-white/50'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-white uppercase">
            {adminUser?.firstName?.[0] || 'A'}
          </div>
          <div className="flex flex-col text-[11px] overflow-hidden">
            <span className="font-semibold text-white truncate">
              {adminUser?.firstName} {adminUser?.lastName}
            </span>
            <span className="text-[10px] text-white/40 font-mono truncate">
              @{adminUser?.username}
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-white/70 hover:text-white transition-all"
        >
          <FiLogOut className="size-3.5" /> Logout
        </button>
      </div>
    </aside>
  );
}
