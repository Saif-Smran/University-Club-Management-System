'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userService, verificationService } from '@/services/api';
import { Sidebar } from '@/components/common/Sidebar';
import { User, ShieldCheck, Upload, Save, CheckCircle2, Eye, IdCard } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [loading, setLoading] = useState(false);
  const [reuploading, setReuploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateProfile({ fullName, studentId });
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReuploadId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an ID card image file');
      return;
    }
    setReuploading(true);
    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('document', file);
      await verificationService.uploadId(formData);
      toast.success('New Student ID photo uploaded for verification review!');
      setFile(null);
      await refreshUser();
    } catch (e) {
      toast.error('Failed to upload ID card photo');
    } finally {
      setReuploading(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Student Profile & Verification</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage your account details and review your student ID card verification status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details Form */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Student ID Card Number</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Student ID Card Verification Box */}
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <IdCard className="w-4 h-4 text-secondary" />
              <span>Student ID Card</span>
            </h3>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Verification Status:</span>
                <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {user?.verificationStatus || 'Approved'}
                </span>
              </div>
              <div className="rounded-xl overflow-hidden bg-black max-h-40 flex items-center justify-center p-2 border border-border">
                <img
                  src={user?.idCardImageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
                  alt="Student ID Card"
                  className="max-h-36 object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Re-upload Form */}
            <form onSubmit={handleReuploadId} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-foreground">Re-upload Student ID Card Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:opacity-90"
              />
              <button
                type="submit"
                disabled={reuploading || !file}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-secondary-container" />
                <span>{reuploading ? 'Uploading...' : 'Submit New Photo'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
