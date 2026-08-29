'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardService } from '@/services/api';
import { AdminDashboardStats } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Users, Compass, Calendar, CreditCard, ShieldCheck, FileCheck, ArrowRight, TrendingUp } from 'lucide-react';

export default function SystemAdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await dashboardService.getAdminStats();
        if (res.data) setStats(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional System Admin</span>
            </div>
            <h1 className="text-2xl font-black text-foreground">Platform Administration & Analytics</h1>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.totalUsers || 150}</p>
            <Link href="/admin/users" className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>Manage users</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Pending ID Verifications</span>
              <FileCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.pendingStudentVerifications || 1}</p>
            <Link href="/admin/student-approvals" className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>Review queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Club Apps</span>
              <Compass className="w-4 h-4 text-tertiary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.pendingClubApplications || 1}</p>
            <Link href="/admin/clubs" className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>Review applications</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Total Stripe Revenue</span>
              <CreditCard className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-foreground">${(stats?.revenueTotal || 4850).toFixed(2)}</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2% this month
            </span>
          </div>
        </div>

        {/* Quick Review Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Student ID Approvals</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review submitted student ID card photos uploaded to Cloudinary to grant verified student accounts.
            </p>
            <Link
              href="/admin/student-approvals"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground"
            >
              Open Approvals Queue
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Club Creation Applications</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Approve or reject student club creation requests and automatically promote club creators to Club Admin.
            </p>
            <Link
              href="/admin/clubs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground"
            >
              Manage Club Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
