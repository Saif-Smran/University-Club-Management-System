'use client';

import React, { useState } from 'react';
import { Event } from '@/types';
import { eventService, paymentService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { X, CreditCard, ShieldCheck, Ticket, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface EventRegistrationModalProps {
  event: Event | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EventRegistrationModal({ event, onClose, onSuccess }: EventRegistrationModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const isFree = event.price === 0;

  const handleConfirmRegistration = async () => {
    if (!user) {
      toast.error('Please sign in before registering for an event.');
      return;
    }

    setLoading(true);
    try {
      if (isFree) {
        await eventService.register(event.id, user.id);
        toast.success(`Successfully registered for ${event.title}!`);
        onSuccess();
        onClose();
      } else {
        const res = await paymentService.createCheckoutSession({
          registrationId: crypto.randomUUID(),
          eventId: event.id,
          amount: event.price,
          currency: 'usd',
          successUrl: `${window.location.origin}/payment/success?eventId=${event.id}`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
        });

        if (res.data?.checkoutUrl) {
          toast.info('Redirecting to Stripe Checkout...');
          window.location.href = res.data.checkoutUrl;
        } else {
          toast.error(res.message || 'Unable to start Stripe Checkout.');
        }
      }
    } catch (err) {
      toast.error('Failed to initiate event registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 text-secondary flex items-center justify-center">
            {isFree ? <Ticket className="w-6 h-6" /> : <CreditCard className="w-6 h-6 text-tertiary" />}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              {isFree ? 'Free Event Ticket' : 'Paid Event Checkout'}
            </span>
            <h3 className="font-bold text-lg leading-snug">{event.title}</h3>
          </div>
        </div>

        {/* Event Summary */}
        <div className="bg-muted/50 p-4 rounded-2xl space-y-2 mb-6 text-xs">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Organizer:</span>
            <span className="font-semibold text-foreground">{event.clubName || 'University Club'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Venue:</span>
            <span className="font-semibold text-foreground">{event.venue}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Registration Fee:</span>
            <span className="font-bold text-sm text-foreground">
              {isFree ? 'FREE' : `$${event.price.toFixed(2)} USD`}
            </span>
          </div>
        </div>

        {!isFree && (
          <div className="p-3 mb-6 rounded-xl bg-tertiary-container/20 border border-tertiary-container/60 text-on-tertiary-container text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 text-tertiary mt-0.5" />
            <p>
              Integrates with <strong>Stripe Sandbox</strong> checkout. You will be redirected to complete payment securely.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRegistration}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Processing...' : isFree ? 'Confirm Ticket' : 'Proceed to Stripe'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
