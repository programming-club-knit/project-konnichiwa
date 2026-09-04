"use client";

import React from "react";
import { 
  FiSearch, 
  FiLoader, 
  FiRefreshCw, 
  FiShield, 
  FiUserCheck, 
  FiUserX, 
  FiSave, 
  FiTrash2,
  FiToggleLeft,
  FiToggleRight
} from "react-icons/fi";
import { UserType, POSTS } from "../types";

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
  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Refresh Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Manage Users</h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 font-bold">
              {filteredUsers.length} users
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Assign executive roles, manage executive approvals, configure batch years, and control signup access.
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={dataLoading}
            className="px-4 py-2 rounded-xl border border-white/10 bg-[#141414] text-white hover:bg-white/10 text-xs font-mono transition-all flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <FiRefreshCw className={`size-3.5 ${dataLoading ? "animate-spin text-[#FF355E]" : ""}`} />
            <span>Refresh Directory</span>
          </button>
        )}
      </div>

      {/* New Signups Permission Banner */}
      <div className="p-5 rounded-2xl border border-white/10 bg-[#141414] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FiShield className="size-4 text-[#FF355E]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Allow New Signups
            </h3>
          </div>
          <p className="text-xs text-white/50">
            Toggle whether new students &amp; executive applicants can create accounts from the public signup page.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSignup}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
            allowSignup
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
              : "bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30"
          }`}
        >
          {allowSignup ? (
            <>
              <FiToggleRight className="size-4 text-emerald-400" /> Enabled (Open)
            </>
          ) : (
            <>
              <FiToggleLeft className="size-4 text-red-400" /> Disabled (Blocked)
            </>
          )}
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="size-3.5 absolute left-3.5 top-3 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, email, username, or mobile..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-white/10 bg-[#141414] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF355E] font-sans transition-all"
          />
        </div>

        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="w-full sm:w-auto h-9 px-3 rounded-xl border border-white/10 bg-[#141414] text-xs text-white focus:outline-none focus:border-[#FF355E] font-mono transition-all"
        >
          <option value="all">All Roles</option>
          <option value="normal">Normal (General Student)</option>
          <option value="member">Member (Executive)</option>
          <option value="admin">Admin (Full Access)</option>
        </select>
      </div>

      {/* Users Directory Table */}
      {dataLoading ? (
        <div className="py-20 text-center text-white/40 font-mono text-xs flex flex-col items-center justify-center gap-3 border border-white/10 rounded-2xl bg-[#141414]">
          <FiLoader className="size-6 animate-spin text-[#FF355E]" />
          <span>Loading user directory...</span>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="border border-white/10 rounded-2xl bg-[#141414] overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-wider text-white/60">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Post</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white/80">
                {filteredUsers.map((u) => {
                  const isPending = u.status === "pending";
                  const isUpdating = updatingUserId === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-white">
                        {u.firstName} {u.lastName}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-white/70">
                        <div className="font-mono text-xs text-white/80">{u.email}</div>
                        <div className="text-[10px] text-white/40 font-mono">
                          {u.email?.toLowerCase().endsWith("@knit.ac.in") ? "Official KNIT" : "External Account"}
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-4 font-mono text-xs text-white/60">
                        {u.username || "-"}
                      </td>

                      {/* Mobile */}
                      <td className="py-3.5 px-4 font-mono text-xs text-white/60">
                        {u.mobile || "-"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border uppercase ${
                            u.status === "approved"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : u.status === "pending"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-red-500/10 border-red-500/30 text-red-300"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              u.status === "approved"
                                ? "bg-emerald-400"
                                : u.status === "pending"
                                ? "bg-amber-400 animate-ping"
                                : "bg-red-400"
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Role Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            setAllUsers((prev) =>
                              prev.map((item) =>
                                item._id === u._id ? { ...item, role: newRole } : item
                              )
                            );
                          }}
                          className="h-8 px-2.5 rounded-lg border border-white/10 bg-[#0f0f0f] text-xs font-mono text-white focus:outline-none focus:border-[#FF355E]"
                        >
                          <option value="normal">normal</option>
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>

                      {/* Batch Input */}
                      <td className="py-3.5 px-4">
                        <input
                          type="number"
                          placeholder="Year"
                          value={u.batch ?? ""}
                          onChange={(e) => {
                            const v = e.target.value === "" ? undefined : Number(e.target.value);
                            setAllUsers((prev) =>
                              prev.map((item) =>
                                item._id === u._id ? { ...item, batch: v } : item
                              )
                            );
                          }}
                          min={2000}
                          max={2100}
                          className="w-20 h-8 px-2 rounded-lg border border-white/10 bg-[#0f0f0f] text-xs font-mono text-white focus:outline-none focus:border-[#FF355E]"
                        />
                      </td>

                      {/* Post Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.post || ""}
                          onChange={(e) => {
                            const newPost = e.target.value;
                            setAllUsers((prev) =>
                              prev.map((item) =>
                                item._id === u._id ? { ...item, post: newPost } : item
                              )
                            );
                          }}
                          className="h-8 px-2 rounded-lg border border-white/10 bg-[#0f0f0f] text-xs font-sans text-white focus:outline-none focus:border-[#FF355E] max-w-[150px] truncate"
                        >
                          <option value="">— None —</option>
                          {POSTS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Approve ${u.firstName} ${u.lastName} as executive member?`)) {
                                    onApproveUser(u._id);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-mono font-medium transition-colors flex items-center gap-1"
                                title="Approve applicant"
                              >
                                <FiUserCheck className="size-3.5" /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Deny registration for ${u.firstName}? This will remove the request.`)) {
                                    onDenyUser(u._id);
                                  }
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 text-xs font-mono font-medium transition-colors flex items-center gap-1"
                                title="Deny applicant"
                              >
                                <FiUserX className="size-3.5" /> Deny
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => onUpdateUser(u)}
                                className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 text-xs font-mono font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                                title="Save role, batch and position changes"
                              >
                                {isUpdating ? (
                                  <>
                                    <FiLoader className="size-3 animate-spin" /> Saving
                                  </>
                                ) : (
                                  <>
                                    <FiSave className="size-3" /> Save
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete user ${u.firstName} ${u.lastName}? This cannot be undone.`)) {
                                    onDenyUser(u._id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                title="Delete user"
                              >
                                <FiTrash2 className="size-3.5" />
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
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center border border-white/10 rounded-2xl bg-[#141414] space-y-3 font-sans">
          <FiSearch className="size-12 text-white/20 mx-auto" />
          <p className="text-base font-bold text-white tracking-tight">No users found</p>
          <p className="text-xs text-white/50 max-w-sm mx-auto font-mono">
            {userSearch
              ? `No users matched "${userSearch}". Try a different keyword.`
              : "No users exist in this category."}
          </p>
        </div>
      )}
    </div>
  );
}
