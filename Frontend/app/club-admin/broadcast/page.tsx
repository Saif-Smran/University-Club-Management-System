'use client';

import React, { useState } from 'react';
import { notificationService } from '@/services/api';
import { Sidebar } from '@/components/common/Sidebar';
import { Radio, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function MemberBroadcastPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Please enter a title and broadcast message');
      return;
    }
    setSending(true);
    try {
      await notificationService.broadcast({
        clubId: 'c1111111-1111-1111-1111-111111111111',
        title,
        message,
      });
      toast.success('Broadcast notification delivered to all club members!');
      setTitle('');
      setMessage('');
    } catch (e) {
      toast.error('Failed to send broadcast notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Member Broadcast System</h1>
          <p className="text-xs text-muted-foreground mt-1">Broadcast urgent in-app notifications and alerts directly to all registered members of your club.</p>
        </div>

        <div className="max-w-xl p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
          <div className="p-3.5 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 text-secondary text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Target Audience: <strong>142 Verified Active Club Members</strong></span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Notification Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Workshop Rescheduled"
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Message Content *</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message to send to all members..."
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Dispatching Notifications...' : 'Send Broadcast to All Members'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
