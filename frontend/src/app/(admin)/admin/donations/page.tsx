"use client";

import { useState } from "react";
import { Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

const SAMPLE_DONATIONS = [
  { id: "1", name: "Ravi Kumar", email: "ravi@example.com", phone: "9876543210", amount: 1008, purpose: "Annadanam", status: "COMPLETED", date: "2024-07-22", razorpayId: "pay_abc123" },
  { id: "2", name: "Sunita Reddy", email: "sunita@example.com", phone: "9865432101", amount: 5001, purpose: "Temple Maintenance", status: "COMPLETED", date: "2024-07-21", razorpayId: "pay_def456" },
  { id: "3", name: "Hari Prasad", email: "hari@example.com", phone: "9854321012", amount: 251, purpose: "General", status: "COMPLETED", date: "2024-07-21", razorpayId: "pay_ghi789" },
  { id: "4", name: "Anitha Devi", email: "anitha@example.com", phone: "9843210123", amount: 2116, purpose: "Festival", status: "PENDING", date: "2024-07-20", razorpayId: "" },
  { id: "5", name: "Suresh Babu", email: "suresh@example.com", phone: "9832101234", amount: 501, purpose: "Navagraha", status: "COMPLETED", date: "2024-07-20", razorpayId: "pay_jkl012" },
];

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "badge-success",
  PENDING: "badge-warning",
  FAILED: "badge-error",
  REFUNDED: "badge-info",
};

const total = SAMPLE_DONATIONS.filter((d) => d.status === "COMPLETED").reduce((s, d) => s + d.amount, 0);

export default function AdminDonationsPage() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_DONATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.purpose.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Donations</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">
            Total collected: <span className="font-semibold text-teal">{formatCurrency(total)}</span>
          </p>
        </div>
        <Button leftIcon={<Download className="w-4 h-4" />} variant="secondary" size="sm">Export CSV</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search donor or purpose..."
          className="form-input pl-10"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              {["Donor", "Amount", "Purpose", "Status", "Payment ID", "Date"].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-poppins font-semibold text-gray-800 text-sm">{d.name}</p>
                  <p className="text-gray-400 text-xs">{d.email}</p>
                </td>
                <td className="px-5 py-3 font-poppins font-bold text-teal text-sm">{formatCurrency(d.amount)}</td>
                <td className="px-5 py-3 font-noto text-sm text-gray-600">{d.purpose}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs ${STATUS_COLORS[d.status] ?? "badge-info"}`}>{d.status}</span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-gray-400">{d.razorpayId || "—"}</td>
                <td className="px-5 py-3 text-gray-500 font-noto text-sm">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 font-noto text-sm">No donations found.</div>
        )}
      </div>
    </div>
  );
}
