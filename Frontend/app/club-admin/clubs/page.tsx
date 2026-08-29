'use client';

import React, { useState, useEffect } from 'react';
import { clubService } from '@/services/api';
import { Club } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Compass, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageMyClubPage() {
  const [club, setClub] = useState<Club | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadClub() {
      setLoading(true);
      try {
        const res = await clubService.getClubs();
        if (res.data && res.data[0]) {
          setClub(res.data[0]);
          setName(res.data[0].name);
          setDescription(res.data[0].description);
          setCategory(res.data[0].category);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadClub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) return;
    setSaving(true);
    try {
      await clubService.updateClub(club.id, { name, description, category });
      toast.success('Club details updated successfully!');
    } catch (e) {
      toast.error('Failed to update club details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Manage Club Information</h1>
          <p className="text-xs text-muted-foreground mt-1">Update your club's public profile, description, and branding.</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading club details...</div>
        ) : !club ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-border">No active club managed.</div>
        ) : (
          <div className="max-w-2xl p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Club Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Club Details'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
