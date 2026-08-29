'use client';

import React, { useState } from 'react';
import { StudentVerification } from '@/types';
import { verificationService } from '@/services/api';
import { CheckCircle2, XCircle, Eye, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface ApprovalTableProps {
  verifications: StudentVerification[];
  onRefresh: () => void;
}

export function ApprovalTable({ verifications, onRefresh }: ApprovalTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<StudentVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await verificationService.approve(id);
      toast.success('Student ID verification approved successfully!');
      onRefresh();
    } catch (err) {
      toast.error('Failed to approve verification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      await verificationService.reject(rejectingItem.id, rejectionReason);
      toast.success('Student ID verification rejected');
      setRejectingItem(null);
      setRejectionReason('');
      onRefresh();
    } catch (err) {
      toast.error('Failed to reject verification');
    } finally {
      setActionLoading(false);
    }
  };

  if (verifications.length === 0) {
    return (
      <div className="p-12 text-center bg-card rounded-2xl border border-border">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-foreground">No Pending Verifications</h3>
        <p className="text-xs text-muted-foreground mt-1">All student ID card submissions have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
            <tr>
              <th className="p-4">Student Info</th>
              <th className="p-4">Student ID Number</th>
              <th className="p-4">ID Card Photo</th>
              <th className="p-4">Submitted Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {verifications.map((item) => (
              <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-foreground text-sm">{item.studentName || 'Student User'}</p>
                  <p className="text-muted-foreground">{item.email}</p>
                </td>
                <td className="p-4 font-mono font-semibold text-primary">
                  {item.studentId}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedImage(item.documentPath)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors group"
                  >
                    <Eye className="w-3.5 h-3.5 text-secondary group-hover:scale-110 transition-transform" />
                    <span>View ID Photo</span>
                  </button>
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => setRejectingItem(item)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-card rounded-3xl overflow-hidden border border-border p-4 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-base mb-3 px-2 text-foreground">Student ID Card Document Preview</h4>
            <div className="rounded-2xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img src={selectedImage} alt="Student ID Card" className="max-h-[70vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Dialog */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-lg">Reject Student Verification</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Please state the reason for rejecting <strong>{rejectingItem.studentName}</strong>'s student ID submission.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Photo is unreadable or student ID number does not match..."
              className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRejectingItem(null)}
                className="flex-1 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
