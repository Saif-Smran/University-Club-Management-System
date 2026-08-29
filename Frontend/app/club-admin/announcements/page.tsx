'use client';

import React, { useState, useEffect } from 'react';
import { announcementService } from '@/services/api';
import { Announcement } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Megaphone, PlusCircle, Pin } from 'lucide-react';
import { toast } from 'sonner';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await announcementService.getAnnouncements();
      if (res.data) setAnnouncements(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Please enter announcement title and content');
      return;
    }
    setSubmitting(true);
    try {
      await announcementService.createAnnouncement({
        clubId: 'c1111111-1111-1111-1111-111111111111',
        title,
        content,
        isPinned,
      });
      toast.success('Announcement published!');
      setTitle('');
      setContent('');
      setIsPinned(false);
      fetchAnnouncements();
    } catch (e) {
      toast.error('Failed to publish announcement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Club Bulletins & Announcements</h1>
          <p className="text-xs text-muted-foreground mt-1">Post announcements and pin important updates for your club members.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Announcement Form */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4 h-fit">
            <h3 className="font-bold text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-secondary" />
              <span>Post New Announcement</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Executive Board Meeting Minutes"
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Content Body *</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Announcement message..."
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-border text-secondary focus:ring-secondary"
                />
                <label htmlFor="pinned" className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5 text-tertiary" />
                  <span>Pin to top of bulletin board</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Publishing...' : 'Publish Announcement'}</span>
              </button>
            </form>
          </div>

          {/* Bulletin Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-base text-foreground">Published Bulletins</h3>
            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div className="p-8 text-center bg-card rounded-2xl border border-border">No announcements posted yet.</div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 relative">
                    {ann.isPinned && (
                      <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <h4 className="font-bold text-sm text-foreground">{ann.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-muted-foreground block pt-2">
                      Posted on {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
