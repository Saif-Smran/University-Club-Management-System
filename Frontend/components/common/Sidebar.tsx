'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  CreditCard,
  Bell,
  ShieldCheck,
  PlusCircle,
  Megaphone,
  Radio,
  FileCheck,
  UserPlus,
  Compass,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const pathname = usePathname();
  const { role, user } = useAuth();

  let navItems: SidebarItem[] = [];

  if (role === 'Admin') {
    navItems = [
      { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Student Verifications', href: '/admin/student-approvals', icon: FileCheck },
      { label: 'User Management', href: '/admin/users', icon: Users },
      { label: 'Club Approvals', href: '/admin/clubs', icon: Compass },
      { label: 'Assign Club Admins', href: '/admin/assign-admin', icon: UserPlus },
    ];
  } else if (role === 'ClubAdmin') {
    navItems = [
      { label: 'Club Dashboard', href: '/club-admin', icon: LayoutDashboard },
      { label: 'Manage Club Info', href: '/club-admin/clubs', icon: Compass },
      { label: 'Member Requests', href: '/club-admin/memberships', icon: Users },
      { label: 'Manage Events', href: '/club-admin/events', icon: Calendar },
      { label: 'Create New Event', href: '/club-admin/events/create', icon: PlusCircle },
      { label: 'Announcements', href: '/club-admin/announcements', icon: Megaphone },
      { label: 'Broadcast Message', href: '/club-admin/broadcast', icon: Radio },
    ];
  } else {
    // Student
    navItems = [
      { label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Profile', href: '/dashboard/profile', icon: User },
      { label: 'Joined Clubs', href: '/dashboard/my-clubs', icon: Users },
      { label: 'Registered Events', href: '/dashboard/my-events', icon: Calendar },
      { label: 'Payment History', href: '/dashboard/payments', icon: CreditCard },
      { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    ];
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-card border-r border-border/60 min-h-[calc(100vh-4rem)] p-4">
      {/* User Status Card */}
      <div className="p-3 mb-6 rounded-xl bg-primary-container/10 border border-primary-container/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center text-sm shadow-sm">
            {user?.fullName.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-foreground truncate">{user?.fullName}</p>
            <span className="text-[10px] font-semibold text-secondary flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-secondary" />
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="space-y-1">
        <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {role === 'Admin' ? 'System Administration' : role === 'ClubAdmin' ? 'Club Management' : 'Student Portal'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-secondary-container' : 'text-muted-foreground'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
