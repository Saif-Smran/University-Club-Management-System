'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/services/api';
import { User } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { UserPlus, Search, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AssignAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await userService.getAllUsers({ search });
        if (res.data) setUsers(res.data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [search]);

  const handlePromoteToClubAdmin = async (userId: string, userName: string) => {
    try {
      await userService.updateRole(userId, 'ClubAdmin');
      toast.success(`${userName} promoted to Club Admin!`);
      const res = await userService.getAllUsers({ search });
      if (res.data) setUsers(res.data);
    } catch (e) {
      toast.error('Failed to promote user');
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">Assign Club Executive Permissions</h1>
          <p className="text-xs text-muted-foreground mt-1">Search student users and assign them Club Admin executive privileges.</p>
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified students..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading users...</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4 font-bold text-foreground">{u.fullName}</td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4 font-mono font-semibold text-primary">{u.studentId || 'N/A'}</td>
                      <td className="p-4 font-semibold text-foreground">{u.role}</td>
                      <td className="p-4 text-right">
                        {u.role === 'ClubAdmin' ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10">
                            Already Club Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePromoteToClubAdmin(u.id, u.fullName)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:opacity-95 shadow-sm inline-flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Make Club Admin</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
