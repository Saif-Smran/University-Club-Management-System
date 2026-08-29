'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import { Calendar, MapPin, Ticket, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegisterClick?: (event: Event) => void;
}

export function EventCard({ event, onRegisterClick }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isFree = event.price === 0;

  return (
    <div className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all flex flex-col justify-between">
      <div>
        {/* Banner Image */}
        <div className="relative h-44 w-full bg-muted overflow-hidden">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3 text-secondary-container" />
            <span>{formattedDate}</span>
          </div>
          <div
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
              isFree
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 text-amber-950'
            }`}
          >
            {isFree ? 'FREE' : `$${event.price.toFixed(2)}`}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <p className="text-[11px] font-semibold text-secondary mb-1">
            Hosted by {event.clubName || 'University Club'}
          </p>
          <h3 className="font-bold text-base text-foreground group-hover:text-secondary transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{event.seatsRemaining} seats remaining of {event.capacity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <Link
          href={`/events/${event.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors"
        >
          Details
        </Link>

        {event.isRegistered ? (
          <span className="py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Registered
          </span>
        ) : (
          <button
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="py-2 px-4 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:opacity-95 shadow-sm transition-all"
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
}
