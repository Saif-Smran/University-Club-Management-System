'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-card text-card-foreground border border-border/80 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-7 h-7 text-secondary-container" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Sign In to UCMS</h1>
          <p className="text-xs text-muted-foreground">Access your verified student profile, clubs, and events</p>
        </div>

        {/* Demo Fast Login Shortcuts */}
        <div className="p-3.5 rounded-2xl bg-tertiary-container/15 border border-tertiary-container/30 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Evaluation Presets:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                switchDemoUser('Student');
                router.push('/dashboard');
              }}
              className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-card border border-border hover:bg-muted text-foreground transition-all"
            >
              Student
            </button>
            <button
              onClick={() => {
                switchDemoUser('ClubAdmin');
                router.push('/club-admin');
              }}
              className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-card border border-border hover:bg-muted text-foreground transition-all"
            >
              Club Admin
            </button>
            <button
              onClick={() => {
                switchDemoUser('Admin');
                router.push('/admin');
              }}
              className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-card border border-border hover:bg-muted text-foreground transition-all"
            >
              Sys Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/40">
          <span>Don't have an account? </span>
          <Link href="/register" className="font-bold text-secondary hover:underline">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
}
