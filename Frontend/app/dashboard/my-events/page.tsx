'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { eventService } from '@/services/api';
import { Event } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Calendar, Ticket, MapPin, QrCode, X, CheckCircle2 } from 'lucide-react';

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Event | null>(null);

  useEffect(() => {
    async function loadRegisteredEvents() {
      setLoading(true);
      try {
        const res = await eventService.getEvents();
        if (res.data) setEvents(res.data.filter((e) => e.isRegistered));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadRegisteredEvents();
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">My Registered Events & Tickets</h1>
          <p className="text-xs text-muted-foreground mt-1">Access your digital event passes and entry QR codes.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading your tickets...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border space-y-3">
            <Ticket className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold text-foreground">No registered events yet</p>
            <Link href="/events" className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground">
              Explore Campus Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-36 w-full bg-muted overflow-hidden relative">
                  <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
                    Registered Ticket
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold text-secondary">{evt.clubName}</span>
                  <h3 className="font-bold text-base text-foreground line-clamp-1">{evt.title}</h3>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>{new Date(evt.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass Active
                  </span>
                  <button
                    onClick={() => setSelectedTicket(evt)}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-sm flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Ticket Pass</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Digital Ticket Pass Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center space-y-4">
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center mx-auto">
                <Ticket className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Digital Entry Ticket</span>
                <h3 className="font-bold text-lg text-foreground leading-snug">{selectedTicket.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedTicket.venue}</p>
              </div>

              {/* Simulated QR Code */}
              <div className="p-4 bg-white rounded-2xl border border-border inline-block shadow-inner mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=UCMS-TICKET-${selectedTicket.id}`}
                  alt="QR Code"
                  className="w-44 h-44 object-contain"
                />
                <span className="block mt-2 font-mono text-[10px] text-slate-800 font-bold">
                  PASS-{selectedTicket.id.substring(0, 8).toUpperCase()}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground">Present this QR code at campus check-in desk for entry scanning.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
