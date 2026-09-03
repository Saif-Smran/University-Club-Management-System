'use client';

import React, { useState, useEffect } from 'react';
import { paymentService } from '@/services/api';
import { Payment } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { PaymentInvoiceModal } from '@/components/payment/PaymentInvoiceModal';
import { useAuth } from '@/context/AuthContext';
import { 
  CreditCard, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Receipt, 
  ShieldCheck, 
  Sparkles,
  Search
} from 'lucide-react';

import { LoadingState } from '@/components/common/LoadingState';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      try {
        const res = await paymentService.getHistory(user?.id);
        if (Array.isArray(res?.data)) {
          setPayments(res.data);
        } else {
          setPayments([]);
        }
      } catch (e) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, [user?.id]);

  const safePayments = Array.isArray(payments) ? payments : [];
  const totalSpent = safePayments.reduce((acc, pay) => acc + (pay?.amount || 0), 0);
  const paidCount = safePayments.filter((p) => (p?.status || '').toLowerCase() === 'paid').length;

  const filteredPayments = safePayments.filter((pay) => {
    if (!pay) return false;
    const query = searchQuery.toLowerCase();
    const payId = pay.id || '';
    const eventTitle = pay.eventTitle || '';
    const paymentMethod = pay.paymentMethod || '';
    return (
      payId.toLowerCase().includes(query) ||
      eventTitle.toLowerCase().includes(query) ||
      paymentMethod.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex max-w-7xl mx-auto min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Finance Ledger</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Payment Receipts & Invoices</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Review itemized event tickets, print verified invoices, and download PDF receipts.
            </p>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Total Amount Spent</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-mono text-foreground">${totalSpent.toFixed(2)} USD</p>
            <p className="text-[11px] text-muted-foreground">Across all registered club events</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Verified Receipts</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-mono text-foreground">{paidCount} Paid Invoices</p>
            <p className="text-[11px] text-muted-foreground">Confirmed Stripe sandbox checkout logs</p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Account Status</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-extrabold text-foreground truncate">{user?.fullName || 'Student Account'}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active Student Billing Ledger
            </p>
          </div>
        </div>

        {/* Table & Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transaction or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <span className="text-xs text-muted-foreground">Showing {filteredPayments.length} of {safePayments.length} transactions</span>
          </div>

          {loading ? (
            <LoadingState message="Loading payment records and invoices..." />
          ) : filteredPayments.length === 0 ? (
            <div className="p-12 text-center bg-card rounded-2xl border border-border space-y-3">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm font-bold text-foreground">No payment records found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Once you register and pay for club events via Stripe, your itemized invoices will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                    <tr>
                      <th className="p-4">Invoice Reference</th>
                      <th className="p-4">Event Details</th>
                      <th className="p-4">Amount Paid</th>
                      <th className="p-4">Gateway</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Invoice & Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredPayments.map((pay) => {
                      const payId = pay.id || 'pay_00000000';
                      const invRef = `INV-${payId.substring(0, 8).toUpperCase()}`;
                      const amount = typeof pay.amount === 'number' ? pay.amount : 0;
                      const currency = pay.currency ? pay.currency.toUpperCase() : 'USD';
                      const dateStr = pay.createdAt ? new Date(pay.createdAt).toLocaleDateString() : 'Recent';

                      return (
                        <tr key={payId} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {invRef}
                            </span>
                            <span className="block text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                              {payId}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-foreground block">{pay.eventTitle || 'Startup Pitch Masterclass'}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {dateStr}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-foreground font-mono text-sm">${amount.toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-muted-foreground ml-1">{currency}</span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {pay.paymentMethod || 'Stripe Sandbox Card'}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              {pay.status || 'Paid'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedPayment(pay)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold transition-all shadow-xs"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Invoice</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal render */}
        {selectedPayment && (
          <PaymentInvoiceModal
            payment={selectedPayment}
            isOpen={!!selectedPayment}
            onClose={() => setSelectedPayment(null)}
            userName={user?.fullName}
            userEmail={user?.email}
          />
        )}
      </div>
    </div>
  );
}
