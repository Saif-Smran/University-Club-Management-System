'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { dashboardService, notificationService } from '@/services/api';
import { StudentDashboardStats, Notification } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { LoadingState } from '@/components/common/LoadingState';
import {
  Users,
  Calendar,
  ShieldCheck,
  Bell,
  ArrowRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const statsRes = await dashboardService.getStudentStats(user?.id);
        const notifRes = await notificationService.getNotifications();
        if (statsRes.data) setStats(statsRes.data);
        if (notifRes.data) setNotifications(notifRes.data.slice(0, 3));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        {/* Welcome Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary text-primary-foreground shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Student Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome back, {user?.fullName || 'Student'}!</h1>
            <p className="text-xs text-primary-foreground/80 max-w-xl">
              Student ID: <strong className="font-mono text-white">{user?.studentId || 'Not provided'}</strong> • Verification Status:{' '}
              <span className="underline font-semibold">{stats?.verificationStatus || user?.verificationStatus || 'Pending'}</span>
            </p>
          </div>
        </div>

        {loading ? <LoadingState message="Loading your dashboard..." /> : <>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Joined Clubs</span>
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.joinedClubsCount ?? 0}</p>
            <Link href="/dashboard/my-clubs" className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>View my clubs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Registered Events</span>
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.upcomingRegisteredEventsCount ?? 0}</p>
            <Link href="/dashboard/my-events" className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>View event tickets</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Verification Status</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats?.verificationStatus || user?.verificationStatus || 'Pending'}
            </p>
            <Link href="/dashboard/profile" className="text-[11px] font-semibold text-secondary hover:underline">
              Check ID Document
            </Link>
          </div>
        </div>

        {/* Joined Clubs & Recent Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Joined Clubs Box */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                <span>My Active Memberships</span>
              </h3>
              <Link href="/clubs" className="text-xs font-semibold text-secondary hover:underline">
                Explore More
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.joinedClubs || []).length === 0 ? (
                <p className="text-xs text-muted-foreground p-4 text-center">No clubs joined yet.</p>
              ) : (
                (stats?.joinedClubs || []).map((club) => (
                  <div key={club.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden shrink-0">
                        <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-foreground">{club.name}</p>
                        <p className="text-[10px] text-muted-foreground">{club.category}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Approved
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Bell className="w-4 h-4 text-secondary" />
                <span>Recent Notifications</span>
              </h3>
              <Link href="/dashboard/notifications" className="text-xs font-semibold text-secondary hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>}
      </div>
    </div>
  );
}
