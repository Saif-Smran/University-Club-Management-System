'use client';

import React, { useState, useEffect } from 'react';
import { verificationService } from '@/services/api';
import { StudentVerification } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { ApprovalTable } from '@/components/admin/ApprovalTable';
import { FileCheck } from 'lucide-react';

export default function StudentApprovalsPage() {
  const [verifications, setVerifications] = useState<StudentVerification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const res = await verificationService.getPending();
      if (res.data) setVerifications(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Verification Queue</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">Pending Student ID Verifications</h1>
          <p className="text-xs text-muted-foreground mt-1">Review student ID card photos uploaded to Cloudinary before granting verified status.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading pending verifications...</div>
        ) : (
          <ApprovalTable verifications={verifications} onRefresh={fetchPendingVerifications} />
        )}
      </div>
    </div>
  );
}
