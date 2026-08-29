'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { eventService } from '@/services/api';
import { Event } from '@/types';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import { Calendar, MapPin, Ticket, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const res = await eventService.getEventById(eventId);
        if (res.data) setEvent(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-xs text-muted-foreground">Loading event details...</div>;
  }

  if (!event) {
    return <div className="max-w-7xl mx-auto p-12 text-center font-bold">Event not found.</div>;
  }

  const isFree = event.price === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/events" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="h-64 sm:h-80 w-full bg-muted overflow-hidden relative">
              <img
                src={event.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold uppercase">
                {isFree ? 'FREE ENTRY' : `$${event.price.toFixed(2)} USD`}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                Organized by {event.clubName || 'University Club'}
              </p>
              <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">{event.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-border/40 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date & Time</p>
                    <p className="font-bold text-foreground">{new Date(event.date).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Campus Venue</p>
                    <p className="font-bold text-foreground">{event.venue}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground mb-2">Event Description</h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Ticket Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-md space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ticket Registration</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground">
                  {isFree ? 'Free' : `$${event.price.toFixed(2)}`}
                </span>
                <span className="text-xs text-muted-foreground">/ person</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground border-y border-border/40 py-4">
              <div className="flex justify-between">
                <span>Total Capacity:</span>
                <span className="font-bold text-foreground">{event.capacity} seats</span>
              </div>
              <div className="flex justify-between">
                <span>Seats Available:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{event.seatsRemaining} remaining</span>
              </div>
              <div className="flex justify-between">
                <span>Deadline:</span>
                <span className="font-bold text-foreground">{new Date(event.registrationDeadline).toLocaleDateString()}</span>
              </div>
            </div>

            {!isFree && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                <span>Stripe Sandbox checkout enabled</span>
              </div>
            )}

            {event.isRegistered ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>You are registered for this event!</span>
              </div>
            ) : (
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full py-3.5 rounded-2xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Register For Ticket</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <EventRegistrationModal
        event={showRegisterModal ? event : null}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setEvent({ ...event, isRegistered: true, seatsRemaining: Math.max(0, event.seatsRemaining - 1) });
          setShowRegisterModal(false);
        }}
      />
    </div>
  );
}
