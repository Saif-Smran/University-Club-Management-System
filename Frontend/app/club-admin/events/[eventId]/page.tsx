'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { eventService } from '@/services/api';
import { EventRegistration } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Users, CheckCircle2, ArrowLeft, Ticket } from 'lucide-react';
import { LoadingState } from '@/components/common/LoadingState';

export default function EventParticipantsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const [participants, setParticipants] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParticipants() {
      setLoading(true);
      try {
        const res = await eventService.getParticipants(eventId);
        if (res.data) setParticipants(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadParticipants();
  }, [eventId]);

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <Link href="/club-admin/events" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Events</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-foreground">Registered Event Participants</h1>
          <p className="text-xs text-muted-foreground mt-1">Review student registrations and payment statuses for this event.</p>
        </div>

        {loading ? (
          <LoadingState message="Loading participants..." />
        ) : participants.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No Students Registered Yet</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="p-4">Student Name & Email</th>
                    <th className="p-4">Ticket Pass Code</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4 text-right">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{p.userName || 'Student'}</p>
                        <p className="text-muted-foreground">{p.userEmail}</p>
                      </td>
                      <td className="p-4 font-mono text-primary font-semibold">{p.qrCode || 'QR-PASS-001'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right text-muted-foreground">{new Date(p.registeredAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
