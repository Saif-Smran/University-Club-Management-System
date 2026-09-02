'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getDashboardLink = () => {
    if (role === 'Admin') return '/admin';
    if (role === 'ClubAdmin') return '/club-admin';
    return '/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 glass-panel transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-secondary-container" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5">
              UCMS <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-semibold">Nexus</span>
            </span>
            <span className="text-[10px] text-muted-foreground block -mt-1">University Club Management</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-primary bg-primary-container/20 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Home
          </Link>
          <Link
            href="/clubs"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/clubs') ? 'text-primary bg-primary-container/20 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Explore Clubs
          </Link>
          <Link
            href="/events"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/events') ? 'text-primary bg-primary-container/20 font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Upcoming Events
          </Link>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-tertiary" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          {isLoading ? (
            <div className="w-24 h-8 rounded bg-muted animate-pulse" aria-hidden="true" />
          ) : user ? (
            <>
              <Link
                href="/dashboard/notifications"
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-semibold flex items-center justify-center text-xs shadow-sm">
                    {user.fullName.substring(0, 2).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-secondary" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-secondary" />
                      My Profile
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        router.push('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors mt-1 border-t border-border/40"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-secondary text-secondary-foreground hover:opacity-95 shadow-sm transition-all"
              >
                Student Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
