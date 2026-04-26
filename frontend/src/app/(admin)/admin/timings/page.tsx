"use client";

import { useState } from "react";
import { Edit2, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TEMPLE_TIMINGS } from "@/lib/constants";

export default function AdminTimingsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timings] = useState(TEMPLE_TIMINGS);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Temple Timings</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Update daily schedule and darshan timings</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Add Entry</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">#</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Activity</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Start Time</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">End Time</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Day Type</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {timings.map((t, idx) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-3 text-gray-400 font-mono text-xs">{idx + 1}</td>
                <td className="px-6 py-3 font-noto font-semibold text-gray-800 text-sm">{t.activity}</td>
                <td className="px-6 py-3 font-poppins text-sm text-saffron font-semibold">{t.time}</td>
                <td className="px-6 py-3 font-poppins text-sm text-gray-600">{"—"}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs ${t.dayType === "WEEKEND" ? "badge-warning" : "badge-info"}`}>{t.dayType}</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(t.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-teal opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 font-noto">
        * Changes made here update the public Temple Timings page immediately.
      </p>
    </div>
  );
}
