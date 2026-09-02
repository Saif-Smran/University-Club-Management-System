'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { clubService, eventService } from '@/services/api';
import { Club, Event } from '@/types';
import { ClubCard } from '@/components/clubs/ClubCard';
import { EventCard } from '@/components/events/EventCard';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import {
  GraduationCap,
  Sparkles,
  Users,
  Calendar,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const clubsRes = await clubService.getClubs();
        const eventsRes = await eventService.getEvents();
        if (clubsRes.data) setClubs(clubsRes.data);
        if (eventsRes.data) setEvents(eventsRes.data);
      } catch (e) {}
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-primary-container bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2400&q=85")',
        }}
      >
        <div className="absolute inset-0 bg-primary/85" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/20 border border-secondary-container/40 text-secondary-container text-xs font-semibold animate-in fade-in slide-in-from-top-4">
              <Sparkles className="w-3.5 h-3.5 text-secondary-container" />
              <span>Academic Nexus 2026 Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary-foreground leading-tight">
              Empowering Student Leadership & <span className="text-secondary-container">Campus Organizations</span>
            </h1>

            <p className="text-sm md:text-base text-primary-foreground/85 max-w-2xl mx-auto leading-relaxed">
              The official University Club Management System. Simplify student verifications, manage club memberships, host free or paid events, and broadcast announcements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/clubs"
                className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-lg shadow-secondary/20 transition-all flex items-center gap-2"
              >
                <span>Explore Campus Clubs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-2xl text-sm font-bold border border-primary-foreground/40 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all shadow-sm flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-secondary" />
                <span>Student ID Registration</span>
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Impact Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-card border border-border/80 shadow-md">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">1,420+</p>
              <p className="text-xs text-muted-foreground">Active Students</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">12+</p>
              <p className="text-xs text-muted-foreground">Approved Clubs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">45+</p>
              <p className="text-xs text-muted-foreground">Annual Events</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">$4,850</p>
              <p className="text-xs text-muted-foreground">Stripe Payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Discover Communities</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">Featured Campus Clubs</h2>
          </div>
          <Link
            href="/clubs"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            <span>View All Clubs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clubs.slice(0, 3).map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">What's Happening</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">Upcoming Campus Events</h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRegisterClick={setSelectedEvent} />
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-card rounded-3xl border border-border/80 p-8 md:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">Institutional Workflows</span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Universities Trust UCMS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 rounded-2xl bg-muted/40 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-secondary-container" />
            </div>
            <h3 className="font-bold text-base text-foreground">Admin Verified Registration</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Students submit official Student ID photos uploaded directly to Cloudinary. System administrators review and verify accounts before granting platform access.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-muted/40 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Stripe Checkout Integration</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paid workshops, hackathons, and galas seamlessly connect with Stripe Sandbox checkout sessions, providing instant webhook receipt confirmation.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-muted/40 border border-border/60">
            <div className="w-10 h-10 rounded-xl bg-tertiary text-tertiary-foreground flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Broadcasting & In-App Alerts</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Club admins broadcast urgent bulletins to all verified active members with unread notification badges and instant status updates.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSuccess={() => setSelectedEvent(null)}
      />
    </div>
  );
}
