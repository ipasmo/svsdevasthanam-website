"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DEITIES } from "@/lib/constants";

export default function AdminDeitiesPage() {
  const [deities] = useState(DEITIES);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Deities</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Manage deity profiles and display order</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Add Deity</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {deities.map((deity) => (
          <div key={deity.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-saffron/10 to-rust/10 flex items-center justify-center relative">
              <span className="text-5xl">🕉️</span>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white rounded-lg shadow text-teal hover:text-teal/80">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 bg-white rounded-lg shadow text-red-400 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-cinzel font-bold text-gray-800 text-base">{deity.name}</h3>
              <p className="text-gray-500 font-noto text-xs mt-1 line-clamp-2">{deity.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-xs text-gray-400">/{deity.slug}</span>
                <span className="text-xs text-gray-400 font-poppins">Order: {deity.orderIndex}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
