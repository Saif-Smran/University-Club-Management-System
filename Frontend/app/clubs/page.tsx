'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clubService } from '@/services/api';
import { Club } from '@/types';
import { ClubCard } from '@/components/clubs/ClubCard';
import { Search, Filter, PlusCircle, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CATEGORIES = ['All', 'Technology', 'Arts & Culture', 'Business', 'Social Work', 'Sports'];

export default function ClubsPage() {
  const router = useRouter();
  const { user, role, isLoading: authLoading } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      setLoading(true);
      try {
        const res = await clubService.getClubs({
          search,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
        });
        if (res.data) setClubs(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, [search, selectedCategory]);

  const handleApplyForClub = () => {
    if (authLoading || !user) {
      router.push('/login');
      return;
    }
    if (role !== 'Student') {
      toast.error('Only logged-in students can apply to create a club');
      return;
    }
    router.push('/dashboard/my-clubs');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Campus Clubs Catalog</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Explore University Clubs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse active student organizations, apply for memberships, or submit an application to create a new club.
          </p>
        </div>

        <Link
          href="/dashboard/my-clubs"
          onClick={(event) => {
            event.preventDefault();
            handleApplyForClub();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-95 shadow-md transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-secondary-container" />
          <span>Apply for New Club Creation</span>
        </Link>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name or keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-border">
          <p className="text-sm font-semibold text-foreground">No clubs found matching your criteria</p>
          <p className="text-xs text-muted-foreground mt-1">Try resetting search terms or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
}
