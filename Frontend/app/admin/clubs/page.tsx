'use client';

import React, { useState, useEffect } from 'react';
import { clubService } from '@/services/api';
import { Club } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Compass, CheckCircle2, XCircle, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminClubsPage() {
  const [pendingClubs, setPendingClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingItem, setRejectingItem] = useState<Club | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingClubs = async () => {
    setLoading(true);
    try {
      const res = await clubService.getPending();
      if (res.data) setPendingClubs(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingClubs();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await clubService.approveClub(id);
      toast.success('Club application approved & activated! Owner promoted to ClubAdmin.');
      fetchPendingClubs();
    } catch (e) {
      toast.error('Failed to approve club');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    setActionLoading(true);
    try {
      await clubService.rejectClub(rejectingItem.id, rejectionReason);
      toast.success('Club creation application rejected');
      setRejectingItem(null);
      setRejectionReason('');
      fetchPendingClubs();
    } catch (e) {
      toast.error('Failed to reject club application');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Pending Club Creation Applications</h1>
          <p className="text-xs text-muted-foreground mt-1">Review student applications to create new campus clubs. Approving automatically promotes creator to ClubAdmin.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading pending club applications...</div>
        ) : pendingClubs.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No Pending Club Creation Applications</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="p-4">Club Name & Category</th>
                    <th className="p-4">Applicant Owner</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {pendingClubs.map((club) => (
                    <tr key={club.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{club.name}</p>
                        <p className="text-muted-foreground">{club.category}</p>
                      </td>
                      <td className="p-4 font-semibold text-primary">{club.ownerName || 'Student Applicant'}</td>
                      <td className="p-4 text-muted-foreground">{new Date(club.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(club.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Promote</span>
                          </button>
                          <button
                            onClick={() => setRejectingItem(club)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600/20 flex items-center gap-1 disabled:opacity-50"
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
          </div>
        )}

        {/* Rejection Dialog */}
        {rejectingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-2 text-rose-600 mb-3">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-base">Reject Club Application</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Reason for rejecting application for <strong>{rejectingItem.name}</strong>:
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Similar club already exists or guidelines not met..."
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
    </div>
  );
}
