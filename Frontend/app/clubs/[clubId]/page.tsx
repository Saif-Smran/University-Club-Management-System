'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { clubService, membershipService, announcementService, eventService } from '@/services/api';
import { Club, Announcement, Event } from '@/types';
import { Users, Calendar, Megaphone, CheckCircle2, Clock, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/common/LoadingState';

export default function ClubDetailPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    async function loadClubData() {
      setLoading(true);
      try {
        const clubRes = await clubService.getClubById(clubId);
        const annRes = await announcementService.getAnnouncements(clubId);
        const evtRes = await eventService.getEvents({ clubId });
        if (clubRes.data) setClub(clubRes.data);
        if (annRes.data) setAnnouncements(annRes.data);
        if (evtRes.data) setEvents(evtRes.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadClubData();
  }, [clubId, user?.id]);

  const handleJoin = async () => {
    if (!club) return;
    setJoining(true);
    try {
      await membershipService.applyToJoin(club.id);
      setClub({ ...club, isJoined: true, membershipStatus: 'Pending' });
      toast.success(`Application submitted to join ${club.name}!`);
    } catch (e) {
      toast.error('Failed to submit membership application');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12">
        <LoadingState message="Loading club details..." />
      </div>
    );
  }

  if (!club) {
    return <div className="max-w-7xl mx-auto p-12 text-center font-bold">Club not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <Link href="/clubs" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Clubs Directory</span>
      </Link>

      {/* Club Banner Header */}
      <div className="relative rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border shadow-md">
            <img
              src={club.logoUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
              alt={club.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary-container/30 text-secondary">
              {club.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">{club.name}</h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-secondary" />
                <strong>{club.memberCount || 1}</strong> Members
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-secondary" />
                Lead: <strong>{club.ownerName || 'Club Admin'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div>
          {club.isJoined ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary-container/20 border border-secondary-container/40 text-secondary font-bold text-xs">
              {club.membershipStatus === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              <span>{club.membershipStatus === 'Approved' ? 'Active Member' : 'Application Pending Approval'}</span>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-6 py-3.5 rounded-2xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all disabled:opacity-50"
            >
              {joining ? 'Submitting Application...' : 'Apply to Join Club'}
            </button>
          )}
        </div>
      </div>

      {/* Description & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
            <h3 className="font-bold text-base text-foreground">About {club.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{club.description}</p>
          </div>

          {/* Announcements Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-secondary" />
              <h3 className="font-bold text-lg text-foreground">Club Bulletins & Announcements</h3>
            </div>

            {announcements.length === 0 ? (
              <p className="text-xs text-muted-foreground p-6 bg-card rounded-2xl border border-border">No announcements posted yet.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{ann.title}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Club Events */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <h3 className="font-bold text-lg text-foreground">Club Events</h3>
          </div>

          {events.length === 0 ? (
            <p className="text-xs text-muted-foreground p-6 bg-card rounded-2xl border border-border">No upcoming events scheduled for this club.</p>
          ) : (
            <div className="space-y-4">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary">
                    {evt.price === 0 ? 'FREE' : `$${evt.price}`}
                  </span>
                  <h4 className="font-bold text-xs text-foreground">{evt.title}</h4>
                  <p className="text-[11px] text-muted-foreground">{evt.venue} • {new Date(evt.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
