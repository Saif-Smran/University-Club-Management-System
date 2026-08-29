'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardService, notificationService } from '@/services/api';
import { ClubAdminDashboardStats } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Users, Calendar, Megaphone, Clock, Radio, PlusCircle, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ClubAdminDashboardPage() {
  const [stats, setStats] = useState<ClubAdminDashboardStats | null>(null);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await dashboardService.getClubAdminStats();
        if (res.data) setStats(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleQuickBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      toast.error('Please enter a title and broadcast message');
      return;
    }
    setBroadcasting(true);
    try {
      const clubId = stats?.managedClubs?.[0]?.id || 'c1111111-1111-1111-1111-111111111111';
      await notificationService.broadcast({
        clubId,
        title: broadcastTitle,
        message: broadcastMessage,
      });
      toast.success('Notification broadcasted to all club members!');
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (e) {
      toast.error('Failed to send broadcast');
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Club Executive Portal</span>
            </div>
            <h1 className="text-2xl font-black text-foreground">Club Admin Dashboard</h1>
          </div>

          <Link
            href="/club-admin/events/create"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Total Members</span>
              <Users className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.totalClubMembers || 142}</p>
            <span className="text-[11px] text-muted-foreground">Active in managed clubs</span>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Memberships</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.pendingMembershipApplications || 4}</p>
            <Link href="/club-admin/memberships" className="text-[11px] font-semibold text-secondary hover:underline">
              Review requests
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Upcoming Events</span>
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.upcomingEventsCount || 3}</p>
            <Link href="/club-admin/events" className="text-[11px] font-semibold text-secondary hover:underline">
              Manage events
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Announcements</span>
              <Megaphone className="w-4 h-4 text-tertiary" />
            </div>
            <p className="text-2xl font-black text-foreground">{stats?.totalAnnouncementsCount || 10}</p>
            <Link href="/club-admin/announcements" className="text-[11px] font-semibold text-secondary hover:underline">
              Manage bulletins
            </Link>
          </div>
        </div>

        {/* Quick Broadcast Widget */}
        <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Radio className="w-5 h-5 text-secondary animate-pulse" />
            <div>
              <h3 className="font-bold text-base text-foreground">Quick Broadcast to Club Members</h3>
              <p className="text-xs text-muted-foreground">Send an immediate in-app notification to all registered club members.</p>
            </div>
          </div>

          <form onSubmit={handleQuickBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Broadcast Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Venue Change for Saturday Hackathon"
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Broadcast Message</label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter detailed message to broadcast..."
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="py-2.5 px-6 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Radio className="w-4 h-4" />
              <span>{broadcasting ? 'Broadcasting...' : 'Send Broadcast Alert'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
