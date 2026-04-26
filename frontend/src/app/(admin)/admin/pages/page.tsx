"use client";

import { useState } from "react";
import { Plus, Edit2, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageStatus } from "@/types";

interface CmsPage {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  updatedAt: string;
}

const SAMPLE: CmsPage[] = [
  { id: "1", slug: "home", title: "Home", status: "ACTIVE", updatedAt: "2024-07-20" },
  { id: "2", slug: "about", title: "About Us", status: "ACTIVE", updatedAt: "2024-07-18" },
  { id: "3", slug: "annadanam", title: "Annadanam", status: "ACTIVE", updatedAt: "2024-07-15" },
  { id: "4", slug: "contact", title: "Contact", status: "DRAFT", updatedAt: "2024-07-10" },
];

const STATUS_COLORS: Record<PageStatus, string> = {
  ACTIVE: "badge-success",
  DISABLED: "badge-error",
  DRAFT: "badge-warning",
  SCHEDULED: "badge-info",
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CmsPage[]>(SAMPLE);

  const toggleStatus = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "ACTIVE" ? "DISABLED" : "ACTIVE" } : p
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Pages</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Manage CMS pages and their visibility</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">New Page</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Page</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide">Last Updated</th>
              <th className="px-6 py-3 text-xs font-poppins font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-poppins font-semibold text-gray-800 text-sm">{page.title}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">/{page.slug}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs ${STATUS_COLORS[page.status]}`}>{page.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-noto text-sm">{page.updatedAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleStatus(page.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-saffron transition-colors"
                      title={page.status === "ACTIVE" ? "Disable" : "Enable"}
                    >
                      {page.status === "ACTIVE" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-teal transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
