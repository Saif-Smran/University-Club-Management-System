'use client';

import React, { useState, useEffect } from 'react';
import { notificationService } from '@/services/api';
import { Notification } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Bell, CheckCheck, Trash2, CheckCircle2, Megaphone, Ticket, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({
        isRead: filter === 'Unread' ? false : undefined,
      });
      if (res.data) setNotifications(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      fetchNotifications();
      toast.success('Marked notification as read');
    } catch (e) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (e) {
      toast.error('Failed to update notifications');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      toast.info('Notification removed');
    } catch (e) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h1 className="text-2xl font-black text-foreground">In-App Notification Center</h1>
            <p className="text-xs text-muted-foreground mt-1">Stay informed on club broadcasts, system alerts, and status updates.</p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-secondary" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['All', 'Unread'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab} Notifications
            </button>
          ))}
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  !n.isRead
                    ? 'bg-secondary-container/10 border-secondary-container/40 shadow-sm'
                    : 'bg-card border-border/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      n.type === 'Event'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : n.type === 'Verification'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {n.type === 'Event' ? (
                      <Ticket className="w-5 h-5" />
                    ) : n.type === 'Verification' ? (
                      <Shield className="w-5 h-5" />
                    ) : (
                      <Megaphone className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-foreground">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-secondary transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 rounded-lg border border-border hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
