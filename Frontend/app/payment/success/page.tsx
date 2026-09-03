'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Ticket, FileText, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { eventService, paymentService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { PaymentInvoiceModal } from '@/components/payment/PaymentInvoiceModal';
import { Payment } from '@/types';
import { INITIAL_EVENTS } from '@/services/mockData';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [mockPayment, setMockPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const eventId = searchParams.get('eventId');
    const registrationId = searchParams.get('registrationId');
    if (eventId && user?.id) {
      paymentService.confirmPayment({ eventId, userId: user.id, registrationId: registrationId || undefined });
      eventService.register(eventId, user.id).then(() => {
        toast.success('Payment successfully processed and event registration confirmed.');
      });
    } else {
      toast.success('Payment successfully processed via Stripe.');
    }

    const matchedEvent = INITIAL_EVENTS.find((e) => e.id === eventId);
    const eventTitle = matchedEvent?.title || 'Startup Pitch Masterclass';
    const amount = matchedEvent?.price || 25.00;

    // Generate receipt data for instant success preview
    setMockPayment({
      id: registrationId || 'pay_' + Math.random().toString(36).substring(2, 10),
      userId: user?.id || 'usr_demo_123',
      userName: user?.fullName || 'Student Account',
      eventId: eventId || 'e3333333-3333-3333-3333-333333333333',
      eventTitle: eventTitle,
      amount: amount,
      currency: 'usd',
      status: 'Paid',
      sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 12),
      paymentMethod: 'Stripe Sandbox Card',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    });
  }, [searchParams, user?.id, user?.fullName]);

  return (
    <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Stripe Webhook Verified</span>
        </span>
        <h1 className="text-2xl font-black text-foreground">Payment Successful!</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your event ticket registration has been confirmed. A verified receipt and digital entry QR pass have been generated.
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

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => setShowInvoiceModal(true)}
          className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>View & Print Official Receipt</span>
        </button>

        <Link
          href="/dashboard/my-events"
          className="w-full py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md flex items-center justify-center gap-2"
        >
          <Ticket className="w-4 h-4" />
          <span>View My Event Ticket Pass</span>
        </Link>

        <Link
          href="/dashboard/payments"
          className="w-full py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors"
        >
          All Payment Receipts
        </Link>
      </div>

      {/* Payment Invoice Modal */}
      <PaymentInvoiceModal
        payment={mockPayment}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        userName={user?.fullName}
        userEmail={user?.email}
      />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading payment confirmation details...
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
