'use client';

import React, { useState, useEffect } from 'react';
import { membershipService } from '@/services/api';
import { Membership } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { CheckCircle2, XCircle, Users, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ClubAdminMembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingItem, setRejectingItem] = useState<Membership | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      // Load mock/API memberships
      const res = await membershipService.approveMembership('m2222222-2222-2222-2222-222222222222');
      setMemberships([
        {
          id: 'm2222222-2222-2222-2222-222222222222',
          userId: '11111111-1111-1111-1111-222222222222',
          userName: 'Sarah Jenkins',
          userEmail: 'sarah.pending@example.com',
          userStudentId: '2023-1-60-045',
          clubId: 'c1111111-1111-1111-1111-111111111111',
          clubName: 'Computer & Robotics Society',
          status: 'Pending',
          appliedAt: '2026-08-25T09:15:00Z',
        },
      ]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await membershipService.approveMembership(id);
      toast.success('Membership application approved!');
      setMemberships(memberships.filter((m) => m.id !== id));
    } catch (e) {
      toast.error('Failed to approve membership');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    setActionLoading(true);
    try {
      await membershipService.rejectMembership(rejectingItem.id, rejectionReason);
      toast.success('Membership application rejected');
      setMemberships(memberships.filter((m) => m.id !== rejectingItem.id));
      setRejectingItem(null);
      setRejectionReason('');
    } catch (e) {
      toast.error('Failed to reject membership');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Club Membership Applications</h1>
          <p className="text-xs text-muted-foreground mt-1">Approve or reject student applications to join your club.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading applications...</div>
        ) : memberships.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No Pending Membership Requests</p>
            <p className="text-xs text-muted-foreground mt-1">All student membership applications have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="p-4">Student Name & Email</th>
                    <th className="p-4">Student ID Number</th>
                    <th className="p-4">Applied Club</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {memberships.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{item.userName}</p>
                        <p className="text-muted-foreground">{item.userEmail}</p>
                      </td>
                      <td className="p-4 font-mono font-semibold text-primary">{item.userStudentId}</td>
                      <td className="p-4 font-semibold text-foreground">{item.clubName}</td>
                      <td className="p-4 text-muted-foreground">{new Date(item.appliedAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingItem(item)}
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

        {/* Rejection Modal */}
        {rejectingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-2 text-rose-600 mb-3">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-base">Reject Membership Request</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Reason for rejecting <strong>{rejectingItem.userName}</strong>'s application:
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Club capacity limit reached or prerequisites missing..."
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
