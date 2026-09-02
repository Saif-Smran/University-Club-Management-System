'use client';

import React, { useState } from 'react';
import { Payment } from '@/types';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Clock, 
  QrCode, 
  Check, 
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentInvoiceModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

export function PaymentInvoiceModal({
  payment,
  isOpen,
  onClose,
  userName,
  userEmail,
}: PaymentInvoiceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !payment) return null;

  const payId = payment.id || 'pay_00000000';
  const invoiceNumber = `INV-${payId.substring(0, 8).toUpperCase()}`;
  const amountVal = typeof payment.amount === 'number' ? payment.amount : 0;
  const currencyVal = payment.currency ? payment.currency.toUpperCase() : 'USD';
  const statusVal = payment.status || 'Paid';
  const createdAtVal = payment.createdAt ? new Date(payment.createdAt) : new Date();
  const formattedDate = createdAtVal.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedPaidAt = payment.paidAt
    ? new Date(payment.paidAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : formattedDate;

  const handleCopyId = () => {
    navigator.clipboard.writeText(payment.id);
    setCopied(true);
    toast.success('Transaction ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const escapePdfText = (line: string) =>
      line.replace(/[^\x20-\x7E]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    
    const eventName = escapePdfText(payment.eventTitle || 'Paid Event Ticket');
    const transactionId = escapePdfText(payment.id);
    const invoiceNo = escapePdfText(invoiceNumber);
    const clientName = escapePdfText(userName || payment.userName || 'Valued Student');
    const clientEmail = escapePdfText(userEmail || 'student@university.edu');
    const method = escapePdfText(payment.paymentMethod || 'Stripe Sandbox Card');
    const payDate = escapePdfText(formattedPaidAt);
    const amountStr = `$${payment.amount.toFixed(2)} ${payment.currency.toUpperCase()}`;
    const statusText = escapePdfText(payment.status.toUpperCase());

    const content = [
      'q',
      '0.03 0.07 0.14 rg',
      '0 710 612 82 re f',
      'Q',
      '0.99 0.99 1 rg',
      'BT',
      '/F2 20 Tf',
      '40 754 Td',
      '(UNIVERSITY CLUB MANAGEMENT SYSTEM) Tj',
      '/F1 10 Tf',
      '0 -18 Td',
      '(OFFICIAL PAYMENT INVOICE & RECEIPT) Tj',
      'ET',
      '0.2 0.8 0.4 rg',
      '40 706 532 4 re f',
      '0.96 0.97 0.98 rg',
      '40 615 532 75 re f',
      '0.85 0.88 0.92 RG',
      '40 615 532 75 re S',
      '0.1 0.15 0.25 rg',
      'BT',
      '/F2 14 Tf',
      '55 665 Td',
      `(${invoiceNo}) Tj`,
      '/F1 9 Tf',
      '0 -18 Td',
      `(DATE: ${formattedDate}   |   STATUS: ${statusText}) Tj`,
      'ET',
      '0.2 0.25 0.35 rg',
      'BT',
      '/F2 10 Tf',
      '55 580 Td',
      '(BILLED TO:) Tj',
      '/F1 9 Tf',
      '0 -16 Td',
      `(${clientName}) Tj`,
      '0 -14 Td',
      `(${clientEmail}) Tj`,
      'ET',
      'BT',
      '/F2 10 Tf',
      '350 580 Td',
      '(ISSUED BY:) Tj',
      '/F1 9 Tf',
      '0 -16 Td',
      '(UCMS Treasury & Student Affairs) Tj',
      '0 -14 Td',
      '(University Campus Headquarters) Tj',
      'ET',
      '0.1 0.15 0.25 rg',
      '40 495 532 24 re f',
      '1 1 1 rg',
      'BT',
      '/F2 9 Tf',
      '55 504 Td',
      '(DESCRIPTION) Tj',
      '350 504 Td',
      '(QTY) Tj',
      '450 504 Td',
      '(AMOUNT) Tj',
      'ET',
      '0.98 0.98 0.99 rg',
      '40 450 532 45 re f',
      '0.85 0.88 0.92 RG',
      '40 450 532 45 re S',
      '0.1 0.15 0.25 rg',
      'BT',
      '/F2 10 Tf',
      '55 475 Td',
      `(${eventName}) Tj`,
      '/F1 8 Tf',
      '0 -14 Td',
      '(Official Registered Entry Pass) Tj',
      '/F1 10 Tf',
      '355 470 Td',
      '(1) Tj',
      '450 470 Td',
      `(${amountStr}) Tj`,
      'ET',
      '0.94 0.98 0.96 rg',
      '340 375 232 60 re f',
      '0.2 0.7 0.4 RG',
      '340 375 232 60 re S',
      '0.1 0.15 0.25 rg',
      'BT',
      '/F1 10 Tf',
      '355 415 Td',
      '(GRAND TOTAL PAID:) Tj',
      '/F2 16 Tf',
      '355 390 Td',
      `(${amountStr}) Tj`,
      'ET',
      '0.2 0.25 0.35 rg',
      'BT',
      '/F2 10 Tf',
      '55 340 Td',
      '(TRANSACTION METADATA) Tj',
      '/F1 9 Tf',
      '0 -18 Td',
      `(Transaction ID: ${transactionId}) Tj`,
      '0 -14 Td',
      `(Payment Gateway: ${method}) Tj`,
      '0 -14 Td',
      `(Confirmation Time: ${payDate}) Tj`,
      'ET',
      '0.85 0.88 0.92 RG',
      '40 230 532 1 re S',
      '0.4 0.45 0.5 rg',
      'BT',
      '/F1 9 Tf',
      '55 210 Td',
      '(This document serves as proof of payment for University Club Management System events.) Tj',
      '0 -14 Td',
      '(Generated automatically via Verified Stripe Sandbox Gateway Integration.) Tj',
      'ET'
    ].join('\n');

    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ucms-invoice-${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success('Official PDF receipt downloaded!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Global CSS Print Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        id="printable-invoice"
        className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden transition-all my-8"
      >
        {/* Header Ribbon / Status Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Building2 className="w-44 h-44 text-white" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official UCMS Invoice</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Receipt</span>
                <span className="text-emerald-400 font-mono text-xl sm:text-2xl">{invoiceNumber}</span>
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Issued on {formattedDate}</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 no-print">
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                aria-label="Close invoice"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>{payment.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Client & Issuer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Billed To</span>
              <p className="font-bold text-foreground text-sm">{userName || payment.userName || 'Student Account'}</p>
              <p className="text-muted-foreground">{userEmail || 'student@university.edu'}</p>
              <p className="text-[11px] font-mono text-muted-foreground pt-1">User ID: {(payment.userId || 'usr_00000000').substring(0, 13)}...</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Issued By</span>
              <p className="font-bold text-foreground text-sm">University Club Management System</p>
              <p className="text-muted-foreground">Office of Student Affairs & Treasury</p>
              <p className="text-muted-foreground">Campus HQ, Academic Building 1</p>
            </div>
          </div>

          {/* Itemized Invoice Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Item Description</span>
              <span>Total</span>
            </div>

            <div className="rounded-2xl border border-border/70 overflow-hidden divide-y divide-border/50">
              <div className="p-4 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-foreground text-sm">{payment.eventTitle || 'University Club Event Ticket'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Confirmed Registration Pass & Official Ticket Fee
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                    <span>Qty: 1</span>
                    <span>•</span>
                    <span>Standard Admission</span>
                  </div>
                </div>
                <div className="text-left sm:text-right font-mono font-extrabold text-foreground text-base">
                  ${payment.amount.toFixed(2)} <span className="text-xs text-muted-foreground">{payment.currency.toUpperCase()}</span>
                </div>
              </div>

              {/* Fee Breakdown Rows */}
              <div className="p-3 bg-muted/20 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">${payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform & Processing Fee</span>
                  <span className="font-mono text-emerald-600 font-semibold">$0.00 (Waived)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (0%)</span>
                  <span className="font-mono text-foreground">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Total Highlight Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Amount Paid</span>
              <p className="text-xs text-muted-foreground">Payment successfully settled</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono text-foreground">${payment.amount.toFixed(2)}</span>
              <span className="text-xs font-bold text-muted-foreground ml-1.5">{payment.currency.toUpperCase()}</span>
            </div>
          </div>

          {/* Transaction Metadata & Verification QR Pass */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground pb-1 border-b border-border/40">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Transaction Metadata</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div>
                  <span className="block text-[10px] text-muted-foreground/80 uppercase font-semibold">Payment Gateway</span>
                  <span className="font-semibold text-foreground">{payment.paymentMethod || 'Stripe Sandbox Card'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-muted-foreground/80 uppercase font-semibold">Payment Date</span>
                  <span className="font-semibold text-foreground">{formattedPaidAt}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] text-muted-foreground/80 uppercase font-semibold">Stripe Reference</span>
                  <span className="font-mono text-[11px] text-foreground truncate block">{payment.sessionId || payment.id}</span>
                </div>
              </div>
            </div>

            {/* QR Pass Box */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-2 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm">
                <QrCode className="w-12 h-12" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Entry Passcode</span>
                <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px] mx-auto">{payment.id.substring(0, 10)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons Bar */}
        <div className="p-6 bg-muted/30 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Reference' : 'Copy Transaction ID'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4 text-indigo-500" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
