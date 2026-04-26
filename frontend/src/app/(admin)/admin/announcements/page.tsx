"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SAMPLE = [
  { id: "1", titleEn: "Temple closed for renovations on Aug 10", isImportant: true, isActive: true, expiresAt: "2024-08-10" },
  { id: "2", titleEn: "Brahmotsavam registration opens Sep 1", isImportant: false, isActive: true, expiresAt: "2024-09-01" },
  { id: "3", titleEn: "New Annadanam sponsor slots available", isImportant: false, isActive: true, expiresAt: null },
];

export default function AdminAnnouncementsPage() {
  const [items] = useState(SAMPLE);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Manage the announcement banner and news</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">New Announcement</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Title</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Expires</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-noto text-sm text-gray-800 max-w-xs">
                  <span className="flex items-center gap-2">
                    {item.isImportant && <AlertCircle className="w-4 h-4 text-rust shrink-0" />}
                    {item.titleEn}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-poppins font-semibold ${item.isImportant ? "text-rust" : "text-gray-400"}`}>
                    {item.isImportant ? "Important" : "Normal"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs ${item.isActive ? "badge-success" : "badge-error"}`}>
                    {item.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-noto text-sm">{item.expiresAt ?? "—"}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-teal opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
