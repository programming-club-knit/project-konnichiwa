import React, { Suspense } from 'react';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { FiLoader } from 'react-icons/fi';

export const metadata = {
  title: "Admin Dashboard | PTSC",
  description: "Manage PTSC club activities, members and events.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#090B14] text-slate-300 font-sans gap-3">
          <FiLoader className="size-8 animate-spin text-[#FF355E]" />
          <span className="text-sm font-semibold tracking-wide text-white">Loading Console...</span>
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
