'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/services/api';
import { User, Role } from '@/types';
import { Sidebar } from '@/components/common/Sidebar';
import { Users, Search, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers({ search });
      if (res.data) setUsers(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await userService.updateRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (e) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user account "${userName}"?`)) return;
    try {
      await userService.deleteUser(userId);
      toast.info('User account deleted');
      fetchUsers();
    } catch (e) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-black text-foreground">User Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage user roles, verify student credentials, or delete user accounts.</p>
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading user accounts...</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase tracking-wider font-semibold border-b border-border/60">
                  <tr>
                    <th className="p-4">Full Name & Email</th>
                    <th className="p-4">Student ID</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-foreground">{u.fullName}</p>
                        <p className="text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="p-4 font-mono font-semibold text-primary">{u.studentId || 'N/A'}</td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                          className="p-1.5 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:ring-2 focus:ring-secondary"
                        >
                          <option value="Student">Student</option>
                          <option value="ClubAdmin">ClubAdmin</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                            u.isVerified
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {u.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          className="p-1.5 rounded-lg border border-border hover:bg-rose-50 text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
