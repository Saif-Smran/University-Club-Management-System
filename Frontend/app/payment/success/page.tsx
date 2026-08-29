'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  useEffect(() => {
    toast.success('Payment successfully processed via Stripe Sandbox!');
  }, []);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Stripe Webhook Verified</span>
          <h1 className="text-2xl font-black text-foreground">Payment Successful!</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your event ticket registration has been confirmed. A receipt and digital entry QR pass have been generated.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/50 border border-border text-xs text-left space-y-2">
          <div className="flex justify-between border-b border-border/40 pb-1.5">
            <span className="text-muted-foreground">Gateway:</span>
            <span className="font-semibold text-foreground">Stripe Sandbox Checkout</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-bold text-emerald-600">PAID & CONFIRMED</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/my-events"
            className="w-full py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>View My Event Ticket</span>
          </Link>
          <Link
            href="/dashboard/payments"
            className="w-full py-2.5 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-foreground"
          >
            View Payment Receipts
          </Link>
        </div>
      </div>
    </div>
  );
}
