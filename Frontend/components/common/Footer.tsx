'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Heart, Shield, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-card text-card-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary-container" />
              </div>
              <span className="font-bold text-base tracking-tight">UCMS Nexus</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Official University Club Management Platform. Seamlessly unifying campus organizations, student verification, event tickets, and Stripe payments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/clubs" className="hover:text-foreground transition-colors">Browse All Clubs</Link></li>
              <li><Link href="/events" className="hover:text-foreground transition-colors">Upcoming Campus Events</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Student Registration</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Account Login</Link></li>
            </ul>
          </div>

          {/* Roles & Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">User Portals</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Student Dashboard</Link></li>
              <li><Link href="/club-admin" className="hover:text-foreground transition-colors">Club Admin Management</Link></li>
              <li><Link href="/admin" className="hover:text-foreground transition-colors">System Admin Portal</Link></li>
              <li><Link href="/admin/student-approvals" className="hover:text-foreground transition-colors">ID Card Verifications</Link></li>
            </ul>
          </div>

          {/* Institutional Integrity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Security & Support</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Protected by JWT session authentication, Cloudinary asset storage, and Stripe Sandbox webhooks.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-secondary">
              <Shield className="w-4 h-4" />
              <span>Verified Campus System</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} University Club Management System. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with Academic Nexus Design System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
