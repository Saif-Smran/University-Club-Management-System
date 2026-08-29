'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-foreground">Payment Cancelled</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The Stripe Checkout session was cancelled or timed out. No charges were made to your account.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Events Catalog</span>
        </Link>
      </div>
    </div>
  );
}
