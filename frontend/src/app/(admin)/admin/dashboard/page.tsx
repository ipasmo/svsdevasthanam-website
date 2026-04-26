"use client";

import { useEffect, useState } from "react";
import { Users, Images, Calendar, DollarSign, TrendingUp, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  change?: string;
}

const PLACEHOLDER_STATS: Stat[] = [
  { label: "Total Donations (Month)", value: formatCurrency(84500), icon: DollarSign, color: "text-teal", change: "+12%" },
  { label: "Gallery Images", value: 248, icon: Images, color: "text-saffron", change: "+5" },
  { label: "Upcoming Events", value: 7, icon: Calendar, color: "text-rust" },
  { label: "Registered Users", value: 4, icon: Users, color: "text-golden" },
];

const RECENT_DONATIONS = [
  { name: "Ravi Kumar", amount: 1008, purpose: "Annadanam", date: "2024-07-22" },
  { name: "Sunita Reddy", amount: 5001, purpose: "Temple Maintenance", date: "2024-07-21" },
  { name: "Hari Prasad", amount: 251, purpose: "General", date: "2024-07-21" },
  { name: "Anitha Devi", amount: 2116, purpose: "Festival", date: "2024-07-20" },
  { name: "Suresh Babu", amount: 501, purpose: "Navagraha", date: "2024-07-20" },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="font-cinzel text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 font-noto text-sm mt-1">Welcome to the SVS Devasthanam admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PLACEHOLDER_STATS.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {change && (
                <span className="text-xs font-poppins font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                  {change}
                </span>
              )}
            </div>
            <p className="font-cinzel font-bold text-xl text-gray-800">{value}</p>
            <p className="text-gray-500 font-noto text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-cinzel font-bold text-gray-700 text-lg">Recent Donations</h2>
          <a href="/admin/donations" className="text-xs text-saffron hover:text-rust font-poppins font-medium transition-colors">
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Donor</th>
                <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Purpose</th>
                <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_DONATIONS.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-poppins font-medium text-gray-800 text-sm">{d.name}</td>
                  <td className="px-6 py-4 font-poppins font-semibold text-teal text-sm">{formatCurrency(d.amount)}</td>
                  <td className="px-6 py-4">
                    <span className="badge-info text-xs">{d.purpose}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-noto text-sm">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
