"use client";

import React from 'react';
import { FiSearch, FiLoader } from 'react-icons/fi';
import { UserType, POSTS } from '../types';

interface UsersTabProps {
  filteredUsers: UserType[];
  setAllUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  userSearch: string;
  setUserSearch: (query: string) => void;
  userRoleFilter: string;
  setUserRoleFilter: (role: string) => void;
  dataLoading: boolean;
  updatingUserId: string | null;
  onApproveUser: (userId: string) => void;
  onDenyUser: (userId: string) => void;
  onUpdateUser: (user: UserType) => void;
}

export function UsersTab({
  filteredUsers,
  setAllUsers,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  dataLoading,
  updatingUserId,
  onApproveUser,
  onDenyUser,
  onUpdateUser,
}: UsersTabProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Users & Roles Management</h1>
          <p className="text-xs text-white/50 mt-0.5">Manage user approvals, assign positions, batches, and system roles.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="size-3.5 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="bg-[#0E101A] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 font-mono w-48 sm:w-60"
            />
          </div>

          <select
            value={userRoleFilter}
            onChange={e => setUserRoleFilter(e.target.value)}
            className="bg-[#0E101A] border border-white/10 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
          >
            <option value="all">All Roles</option>
            <option value="normal">Normal</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {dataLoading ? (
        <div className="py-16 text-center text-white/40 font-mono text-xs flex items-center justify-center gap-2 border border-white/10 rounded-xl bg-[#0E101A]">
          <FiLoader className="size-4 animate-spin text-white/60" /> Loading user directory...
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="border border-white/10 rounded-xl bg-[#0E101A] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40 bg-white/[0.02]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Post</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-white/80">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{u.firstName} {u.lastName}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-white/50">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                      u.status === 'approved'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : u.status === 'pending'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                        : 'border-white/10 bg-white/5 text-white/50'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        u.status === 'approved' ? 'bg-emerald-400' : u.status === 'pending' ? 'bg-amber-400' : 'bg-white/40'
                      }`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setAllUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
                      }}
                      className="bg-[#0B0D19] border border-white/15 rounded-md py-1 px-2 text-[11px] font-mono text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="normal">normal</option>
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      placeholder="Year"
                      value={u.batch ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        setAllUsers(prev => prev.map(x => x._id === u._id ? { ...x, batch: val } : x));
                      }}
                      className="w-16 bg-[#0B0D19] border border-white/15 rounded-md py-1 px-2 text-[11px] font-mono text-white focus:outline-none focus:border-white/30"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.post || ''}
                      onChange={(e) => {
                        const newPost = e.target.value;
                        setAllUsers(prev => prev.map(x => x._id === u._id ? { ...x, post: newPost } : x));
                      }}
                      className="bg-[#0B0D19] border border-white/15 rounded-md py-1 px-2 text-[11px] font-mono text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="">—</option>
                      {POSTS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {u.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => onApproveUser(u._id)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-md text-[11px] font-mono transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onDenyUser(u._id)}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 hover:text-red-400 rounded-md text-[11px] font-mono transition-all"
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={updatingUserId === u._id}
                          onClick={() => onUpdateUser(u)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-md text-[11px] font-mono transition-all"
                        >
                          {updatingUserId === u._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => onDenyUser(u._id)}
                          className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 hover:text-red-400 rounded-md text-[11px] font-mono transition-all"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center border border-white/10 rounded-xl bg-[#0E101A] text-white/40 font-mono text-xs">
          No matching users found.
        </div>
      )}
    </div>
  );
}
