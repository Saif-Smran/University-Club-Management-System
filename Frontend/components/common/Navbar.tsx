'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, logout, switchDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
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
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-tertiary-container bg-tertiary-container/10 text-xs font-semibold text-tertiary hover:bg-tertiary-container/20 transition-all"
              title="Switch user role for testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              <span>Role: <strong className="underline">{role}</strong></span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl p-1 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Test Role Switcher
                </div>
                <button
                  onClick={() => {
                    switchDemoUser('Student');
                    setShowDemoMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                    role === 'Student' ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span>Student (John)</span>
                  {role === 'Student' && <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('ClubAdmin');
                    setShowDemoMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                    role === 'ClubAdmin' ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span>Club Admin (Alex)</span>
                  {role === 'ClubAdmin' && <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('Admin');
                    setShowDemoMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between ${
                    role === 'Admin' ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span>System Admin (Dr. Carter)</span>
                  {role === 'Admin' && <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard/notifications"
                className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
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
