'use client';

import React, { useState, useEffect } from 'react';
import { eventService } from '@/services/api';
import { Event } from '@/types';
import { EventCard } from '@/components/events/EventCard';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/common/LoadingState';
import { Search, Calendar, Filter } from 'lucide-react';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Free' | 'Paid'>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await eventService.getEvents({ search }, user?.id);
        if (res.data) {
          let list = res.data;
          if (filterType === 'Free') list = list.filter((e) => e.price === 0);
          if (filterType === 'Paid') list = list.filter((e) => e.price > 0);
          setEvents(list);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [search, filterType, user?.id, refreshKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-border/60 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>Campus Events</span>
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Upcoming Campus Events</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Discover hackathons, workshops, guest lectures, and cultural galas hosted by university clubs.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, venue..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          {(['All', 'Free', 'Paid'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {type} Events
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingState message="Loading campus events..." />
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-border">
          <p className="text-sm font-semibold text-foreground">No events found</p>
          <p className="text-xs text-muted-foreground mt-1">Try modifying your search or ticket filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} onRegisterClick={setSelectedEvent} />
          ))}
        </div>
      )}

      {/* Registration Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSuccess={() => {
          setSelectedEvent(null);
          setRefreshKey((currentKey) => currentKey + 1);
        }}
      />
    </div>
  );
}
