"use client";

import React, { useState } from 'react';
import { 
  FiUsers, 
  FiRefreshCw, 
  FiSearch, 
  FiLoader, 
  FiCheck, 
  FiTrash2, 
  FiChevronDown,
  FiUserCheck,
  FiShield,
  FiAlertCircle,
  FiX,
  FiMail,
  FiPhone,
  FiAward,
  FiCalendar,
  FiUser,
  FiEdit2,
  FiExternalLink
} from 'react-icons/fi';
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
  allowSignup: boolean;
  onToggleSignup: () => void;
  onApproveUser: (userId: string) => void;
  onDenyUser: (userId: string) => void;
  onUpdateUser: (user: UserType) => void;
  onRefresh?: () => void;
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
  allowSignup,
  onToggleSignup,
  onApproveUser,
  onDenyUser,
  onUpdateUser,
  onRefresh,
}: UsersTabProps) {
  // Modal State for inspecting & editing user full details
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalUser, setModalUser] = useState<UserType | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  const handleOpenUserModal = (user: UserType) => {
    setSelectedUser(user);
    setModalUser({ ...user });
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setModalUser(null);
  };

  const handleSaveModalUser = async () => {
    if (!modalUser) return;
    setModalSaving(true);
    try {
      await onUpdateUser(modalUser);
      // update local state
      setAllUsers(prev => prev.map(u => u._id === modalUser._id ? { ...modalUser } : u));
      setSelectedUser({ ...modalUser });
    } catch (err) {
      console.error("Failed to update user:", err);
    } finally {
      setModalSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Title and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Manage Users & Roles</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any user&apos;s name to inspect full credentials, role assignments, and registration statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={dataLoading}
              className="px-3.5 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FiRefreshCw className={`size-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* New Signups Control Card */}
      <div className="p-4 rounded-lg border border-white/10 bg-[#121626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Allow New Signups</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle whether new users can create accounts from the signup portal.
          </p>
        </div>
        <button
          onClick={onToggleSignup}
          className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide border transition-all ${
            allowSignup
              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/60'
              : 'bg-red-950/40 border-red-500/20 text-red-400 hover:bg-red-950/60'
          }`}
        >
          {allowSignup ? 'Enabled (Signups Open)' : 'Disabled (Signups Closed)'}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, username, roll..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="w-full bg-[#121626] border border-white/10 rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-white/30 font-sans"
          />
        </div>

        <div className="relative min-w-[160px]">
          <select
            value={userRoleFilter}
            onChange={e => setUserRoleFilter(e.target.value)}
            className="w-full bg-[#121626] border border-white/10 rounded-md py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-white/30 font-sans appearance-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="normal">Normal Users</option>
            <option value="member">Club Executives</option>
            <option value="admin">Administrators</option>
          </select>
          <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
        </div>
      </div>

      {/* Users Table without username or mobile */}
      {dataLoading ? (
        <div className="py-16 text-center text-slate-400 font-sans text-xs flex items-center justify-center gap-2 border border-white/10 rounded-lg bg-[#121626]">
          <FiLoader className="size-4 animate-spin text-white/60" /> Loading member records...
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="w-full overflow-x-auto border border-white/10 rounded-lg bg-[#121626]">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Club Post</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-slate-300">
              {filteredUsers.map(u => {
                const isPending = u.status === 'pending';
                const isUpdating = updatingUserId === u._id;

                return (
                  <tr key={u._id} className="hover:bg-white/[0.025] transition-colors group">
                    {/* Clickable Name with Avatar */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleOpenUserModal(u)}
                        className="flex items-center gap-2.5 text-left group/btn focus:outline-none"
                      >
                        <div className="size-7 rounded bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center uppercase text-[11px] shrink-0 group-hover/btn:border-white/30 group-hover/btn:bg-white/10 transition-colors">
                          {u.firstName?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-xs group-hover/btn:text-cyan-300 group-hover/btn:underline flex items-center gap-1.5 transition-colors">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Click to inspect
                          </div>
                        </div>
                      </button>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 text-xs">
                      {u.email}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
                        u.status === 'approved'
                          ? 'border-emerald-500/20 bg-emerald-950/40 text-emerald-400'
                          : isPending
                          ? 'border-amber-500/20 bg-amber-950/40 text-amber-400'
                          : 'border-red-500/20 bg-red-950/40 text-red-400'
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          u.status === 'approved' ? 'bg-emerald-400' : isPending ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        {u.status}
                      </span>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="relative min-w-[110px]">
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            setAllUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
                          }}
                          className="w-full bg-[#090B14] border border-white/15 rounded py-1 pl-2.5 pr-6 text-xs font-sans text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                        >
                          <option value="normal">normal</option>
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                        </select>
                        <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3" />
                      </div>
                    </td>

                    {/* Batch Year */}
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        placeholder="Year"
                        min={2000}
                        max={2100}
                        value={u.batch ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          setAllUsers(prev => prev.map(x => x._id === u._id ? { ...x, batch: val } : x));
                        }}
                        className="w-18 bg-[#090B14] border border-white/15 rounded py-1 px-2 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                      />
                    </td>

                    {/* Committee Post Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="relative min-w-[130px]">
                        <select
                          value={u.post || ''}
                          onChange={(e) => {
                            const newPost = e.target.value;
                            setAllUsers(prev => prev.map(x => x._id === u._id ? { ...x, post: newPost } : x));
                          }}
                          className="w-full bg-[#090B14] border border-white/15 rounded py-1 pl-2.5 pr-6 text-xs font-sans text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer truncate"
                        >
                          <option value="">—</option>
                          {POSTS.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3" />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded text-xs font-medium transition-all"
                          title="View full user details & manage"
                        >
                          Inspect
                        </button>
                        {isPending ? (
                          <>
                            <button
                              onClick={() => {
                                if (window.confirm(`Approve user "${u.firstName} ${u.lastName}"?`)) {
                                  onApproveUser(u._id);
                                }
                              }}
                              className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 rounded text-xs font-medium transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deny signup request for "${u.firstName} ${u.lastName}"?`)) {
                                  onDenyUser(u._id);
                                }
                              }}
                              className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 rounded text-xs font-medium transition-all"
                            >
                              Deny
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              disabled={isUpdating}
                              onClick={() => onUpdateUser(u)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded text-xs font-medium transition-all disabled:opacity-50"
                            >
                              {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete user "${u.firstName} ${u.lastName}"? This action cannot be undone.`)) {
                                  onDenyUser(u._id);
                                }
                              }}
                              className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded text-xs font-medium transition-all"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center border border-white/10 rounded-lg bg-[#121626] space-y-2">
          <FiUsers className="size-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">No users found matching your query.</p>
        </div>
      )}

      {/* User Details & Management Modal */}
      {modalUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121626] border border-white/15 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-md bg-white/10 border border-white/15 text-white flex items-center justify-center font-bold text-base font-mono uppercase shrink-0">
                  {modalUser.firstName?.[0]}{modalUser.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {modalUser.firstName} {modalUser.lastName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    @{modalUser.username}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseUserModal}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FiX className="size-4" />
              </button>
            </div>

            {/* Modal Body: User Credentials & Editable Attributes */}
            <div className="space-y-4 text-xs font-sans">
              {/* Contact & Roll info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-[#090B14] border border-white/10">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FiMail className="size-3 text-slate-500" /> Email Address
                  </span>
                  <span className="text-xs font-mono text-white break-all block">
                    {modalUser.email}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FiPhone className="size-3 text-slate-500" /> Mobile Number
                  </span>
                  <span className="text-xs font-mono text-white block">
                    {modalUser.mobile ? `+91 ${modalUser.mobile}` : 'Not provided'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FiUser className="size-3 text-slate-500" /> Roll Number
                  </span>
                  <span className="text-xs font-mono text-slate-200 block">
                    {modalUser.rollNo || 'Not specified'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FiCalendar className="size-3 text-slate-500" /> Account Created
                  </span>
                  <span className="text-xs font-mono text-slate-400 block">
                    {modalUser.createdAt ? new Date(modalUser.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>

              {/* Status, Role & Position Modifier */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Access & Status Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Status Switcher */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">Account Status</label>
                    <div className="relative">
                      <select
                        value={modalUser.status}
                        onChange={e => setModalUser(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                        className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending Approval</option>
                        <option value="denied">Denied / Inactive</option>
                      </select>
                      <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
                    </div>
                  </div>

                  {/* Role Switcher */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">Portal Role</label>
                    <div className="relative">
                      <select
                        value={modalUser.role}
                        onChange={e => setModalUser(prev => prev ? ({ ...prev, role: e.target.value as any }) : null)}
                        className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer"
                      >
                        <option value="normal">Normal User</option>
                        <option value="member">Club Executive</option>
                        <option value="admin">Administrator</option>
                      </select>
                      <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
                    </div>
                  </div>

                  {/* Batch Year */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">Batch Year</label>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      placeholder="e.g. 2026"
                      value={modalUser.batch ?? ''}
                      onChange={e => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        setModalUser(prev => prev ? ({ ...prev, batch: val }) : null);
                      }}
                      className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  {/* Club Post */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">Committee Post</label>
                    <div className="relative">
                      <select
                        value={modalUser.post || ''}
                        onChange={e => setModalUser(prev => prev ? ({ ...prev, post: e.target.value }) : null)}
                        className="w-full bg-[#090B14] border border-white/15 rounded-md py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer truncate"
                      >
                        <option value="">None / General</option>
                        {POSTS.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 size-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              {/* Delete / Deny */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete user "${modalUser.firstName} ${modalUser.lastName}"? This action cannot be undone.`)) {
                    onDenyUser(modalUser._id);
                    handleCloseUserModal();
                  }
                }}
                className="px-3.5 py-2 border border-red-500/20 bg-red-950/30 hover:bg-red-950/60 text-red-400 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <FiTrash2 className="size-3.5" />
                Delete User
              </button>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseUserModal}
                  className="px-3.5 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 rounded-md text-xs font-medium transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalUser}
                  disabled={modalSaving}
                  className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                >
                  {modalSaving ? <FiLoader className="size-3.5 animate-spin" /> : <FiCheck className="size-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
