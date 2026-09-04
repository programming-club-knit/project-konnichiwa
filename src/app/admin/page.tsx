import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AdminLoginForm } from '@/components/admin/admin-login';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Login | PTSC",
  description: "Secure login portal for PTSC administrators.",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user) {
    if (user.role === 'admin' || user.role === 'member') {
      redirect('/admin/dashboard');
    }
    redirect('/profile');
  }

  return <AdminLoginForm />;
}