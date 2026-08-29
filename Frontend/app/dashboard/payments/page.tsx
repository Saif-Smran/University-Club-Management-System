'use client';

import React, { useState, useEffect } from 'react';
import { paymentService } from '@/services/api';
import { Payment } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { CreditCard, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      try {
        const res = await paymentService.getHistory();
        if (res.data) setPayments(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Stripe Payment History</h1>
          <p className="text-xs text-muted-foreground mt-1">Review receipts for paid event registrations and ticket checkouts.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading payment records...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">
            <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No payment history found</p>
            <p className="text-xs text-muted-foreground mt-1">Paid event registrations will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Event Details</th>
                    <th className="p-4">Amount Paid</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Stripe Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4 font-mono font-semibold text-primary">{pay.id}</td>
                      <td className="p-4 font-bold text-foreground">{pay.eventTitle || 'Paid Event Ticket'}</td>
                      <td className="p-4 font-extrabold text-foreground">${pay.amount.toFixed(2)} USD</td>
                      <td className="p-4 text-muted-foreground">{pay.paymentMethod || 'Stripe Sandbox Card'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          {pay.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={pay.receiptUrl || 'https://stripe.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted font-semibold text-foreground transition-colors"
                        >
                          <span>Stripe Receipt</span>
                          <ExternalLink className="w-3 h-3 text-secondary" />
                        </a>
                      </td>
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
