'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventService } from '@/services/api';
import { Event } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Calendar, PlusCircle, Trash2, Users, Ticket, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ClubAdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getManagedEvents(undefined, user?.id);
      if (res.data) setEvents(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user?.id]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await eventService.deleteEvent(id);
      toast.info('Event deleted');
      fetchEvents();
    } catch (e) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h1 className="text-2xl font-black text-foreground">Club Events Management</h1>
            <p className="text-xs text-muted-foreground mt-1">Create, edit, track registrations, and delete club events.</p>
          </div>

          <Link
            href="/club-admin/events/create"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No Events Created</p>
            <Link
              href="/club-admin/events/create"
              className="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-36 w-full bg-muted overflow-hidden relative">
                  <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 text-white backdrop-blur-md">
                    {evt.price === 0 ? 'FREE' : `$${evt.price.toFixed(2)}`}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-foreground line-clamp-1">{evt.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{evt.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <span>Venue: <strong>{evt.venue}</strong></span>
                    <span>Registrations: <strong>{evt.registeredCount}/{evt.capacity}</strong></span>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-border/40 pt-3">
                  <Link
                    href={`/club-admin/events/${evt.id}`}
                    className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Participants</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-1.5 rounded-lg border border-border hover:bg-rose-50 text-rose-600 transition-colors"
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
