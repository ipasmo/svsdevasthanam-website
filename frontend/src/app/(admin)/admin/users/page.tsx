"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/types";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string | null;
}

const SAMPLE: AdminUser[] = [
  { id: "1", name: "Temple Admin", email: "admin@svsdevastanam.org", role: "SUPER_ADMIN", isActive: true, lastLogin: "2024-07-22" },
  { id: "2", name: "Content Editor", email: "editor@svsdevastanam.org", role: "CONTENT_EDITOR", isActive: true, lastLogin: "2024-07-20" },
  { id: "3", name: "Finance Officer", email: "finance@svsdevastanam.org", role: "FINANCE_ADMIN", isActive: true, lastLogin: "2024-07-18" },
];

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "badge-error",
  CONTENT_EDITOR: "badge-info",
  FINANCE_ADMIN: "badge-warning",
};

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_EDITOR: "Content Editor",
  FINANCE_ADMIN: "Finance Admin",
};

export default function AdminUsersPage() {
  const [users] = useState<AdminUser[]>(SAMPLE);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Admin Users</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Manage access and roles for admin panel users</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Add User</Button>
      </div>

      {/* Role legend */}
      <div className="flex gap-3 flex-wrap">
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <span key={role} className={`text-xs ${ROLE_COLORS[role as UserRole]}`}>
            {label}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-saffron" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-teal"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="font-poppins font-semibold text-gray-800 text-base">{user.name}</h3>
            <p className="text-gray-500 font-noto text-xs mt-0.5">{user.email}</p>
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</span>
              <span className={`text-xs font-poppins font-medium ${user.isActive ? "text-teal" : "text-gray-400"}`}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            {user.lastLogin && (
              <p className="text-gray-400 text-xs font-noto mt-2">Last login: {user.lastLogin}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
