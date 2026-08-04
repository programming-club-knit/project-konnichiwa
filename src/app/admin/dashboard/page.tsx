import React from 'react';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata = {
  title: "Admin Dashboard | PTSC",
  description: "Manage PTSC club activities, members and events.",
};

export default function DashboardPage() {
  return <AdminDashboard />;
}
