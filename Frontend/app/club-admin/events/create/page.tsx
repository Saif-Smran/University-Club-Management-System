'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventService } from '@/services/api';
import { Sidebar } from '@/components/common/Sidebar';
import { Calendar, PlusCircle, ArrowLeft, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('15.00');
  const [capacity, setCapacity] = useState('100');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !venue || !date) {
      toast.error('Please complete all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await eventService.createEvent({
        title,
        description,
        bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
        date: new Date(date).toISOString(),
        venue,
        price: isPaid ? parseFloat(price) || 0 : 0,
        capacity: parseInt(capacity) || 50,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : new Date().toISOString(),
      });
      toast.success('New event created successfully!');
      router.push('/club-admin/events');
    } catch (err) {
      toast.error('Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Create New Club Event</h1>
          <p className="text-xs text-muted-foreground mt-1">Host a free workshop or paid ticketed contest with Stripe checkout.</p>
        </div>

        <div className="max-w-2xl p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Event Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual AI & Robotics Hackathon 2026"
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Event Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed itinerary, rules, mentor details..."
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Campus Venue *</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Central Auditorium & Hall A"
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Ticket Type Toggle (Free vs Paid) */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">Event Ticket Type</span>
                  <span className="text-[11px] text-muted-foreground">Select whether registration is free or requires Stripe Checkout.</span>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
                  <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      !isPaid ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isPaid ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Paid ($)
                  </button>
                </div>
              </div>

              {isPaid && (
                <div className="pt-2 animate-in fade-in">
                  <label className="block text-xs font-bold text-foreground mb-1">Registration Fee (USD) *</label>
                  <div className="relative max-w-xs">
                    <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Maximum Seats Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Registration Deadline</label>
                <input
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Banner Image URL (Optional)</label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{submitting ? 'Publishing Event...' : 'Publish Event'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
