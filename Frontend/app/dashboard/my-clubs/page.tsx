'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { clubService, membershipService } from '@/services/api';
import { Club } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Users, PlusCircle, LogOut, CheckCircle2, Clock, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function MyClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchJoinedClubs = async () => {
    setLoading(true);
    try {
      const res = await clubService.getClubs();
      if (res.data) setClubs(res.data.filter((c) => c.isJoined));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedClubs();
  }, []);

  const handleLeave = async (clubId: string, clubName: string) => {
    try {
      await membershipService.leaveClub(clubId);
      toast.info(`Left ${clubName}`);
      fetchJoinedClubs();
    } catch (e) {
      toast.error('Failed to leave club');
    }
  };

  const handleApplyNewClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('Please enter club name and description');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      if (file) formData.append('logo', file);

      await clubService.applyForClub(formData);
      toast.success('Club creation application submitted! Pending admin approval.');
      setShowApplyModal(false);
      setName('');
      setDescription('');
      fetchJoinedClubs();
    } catch (e) {
      toast.error('Failed to submit club creation application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <h1 className="text-2xl font-black text-foreground">My Joined & Applied Clubs</h1>
            <p className="text-xs text-muted-foreground mt-1">Manage your active memberships or submit an application for a new club.</p>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for New Club</span>
          </button>
        </div>

        {/* Club List */}
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading your clubs...</div>
        ) : clubs.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border space-y-3">
            <Users className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm font-semibold text-foreground">No clubs joined yet</p>
            <Link
              href="/clubs"
              className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground"
            >
              Browse Campus Clubs Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubs.map((club) => (
              <div key={club.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border">
                    <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary">
                      {club.category}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-1">{club.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      {club.membershipStatus === 'Approved' ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Member
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Clock className="w-3.5 h-3.5" /> Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <Link href={`/clubs/${club.id}`} className="text-xs font-bold text-secondary hover:underline">
                    View Club Details
                  </Link>
                  <button
                    onClick={() => handleLeave(club.id, club.name)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Leave Club</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Club Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card text-card-foreground border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-black text-lg mb-1">Apply to Create a New Club</h3>
              <p className="text-xs text-muted-foreground mb-4">Submitted applications will be reviewed by System Administration.</p>

              <form onSubmit={handleApplyNewClub} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Club Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Competitive AI & Data Science Club"
                    className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Business">Business</option>
                    <option value="Social Work">Social Work</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Club Description & Purpose</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your club's objectives, proposed activities, and student benefits..."
                    className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">Club Logo Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:opacity-90"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
