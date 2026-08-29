'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Club } from '@/types';
import { membershipService } from '@/services/api';
import { Users, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ClubCardProps {
  club: Club;
  onJoinSuccess?: () => void;
}

export function ClubCard({ club, onJoinSuccess }: ClubCardProps) {
  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(club.isJoined);
  const [status, setStatus] = useState(club.membershipStatus);

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await membershipService.applyToJoin(club.id);
      setIsJoined(true);
      setStatus('Pending');
      toast.success(`Application submitted to join ${club.name}!`);
      if (onJoinSuccess) onJoinSuccess();
    } catch (err) {
      toast.error('Failed to submit club application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all flex flex-col justify-between">
      <div>
        {/* Header Banner & Logo */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted shrink-0 border border-border/60 shadow-inner group-hover:scale-105 transition-transform">
            <img
              src={club.logoUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
              alt={club.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary mb-1">
              {club.category}
            </span>
            <h3 className="font-semibold text-base text-foreground leading-snug group-hover:text-secondary transition-colors line-clamp-1">
              {club.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{club.memberCount || 1} Active Members</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-6">
          {club.description}
        </p>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/40">
        <Link
          href={`/clubs/${club.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1"
        >
          <span>View Club</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {isJoined ? (
          <span
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 ${
              status === 'Approved'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {status === 'Approved' ? 'Member' : 'Applied'}
          </span>
        ) : (
          <button
            onClick={handleJoin}
            disabled={loading}
            className="py-2 px-3 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:opacity-95 shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Join Club'}
          </button>
        )}
      </div>
    </div>
  );
}
