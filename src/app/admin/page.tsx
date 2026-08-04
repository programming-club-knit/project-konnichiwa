import React from 'react';
import { AdminLoginForm } from '@/components/admin/admin-login';

export const metadata = {
  title: "Admin Login | PTSC",
  description: "Secure login portal for PTSC administrators.",
};

export default function AdminPage() {
  return <AdminLoginForm />;
}