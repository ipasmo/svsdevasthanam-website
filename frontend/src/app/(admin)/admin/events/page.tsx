"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SAMPLE_EVENTS = [
  { id: "1", title: "Brahmotsavam 2024", date: "2024-11-01", endDate: "2024-11-11", category: "Festival", isActive: true },
  { id: "2", title: "Deepotsavam", date: "2024-10-29", endDate: "2024-10-29", category: "Festival", isActive: true },
  { id: "3", title: "Monthly Sahasranama Archana", date: "2024-08-04", endDate: "2024-08-04", category: "Pooja", isActive: true },
  { id: "4", title: "Independence Day Homam", date: "2024-08-15", endDate: "2024-08-15", category: "Special", isActive: false },
];

export default function AdminEventsPage() {
  const [events] = useState(SAMPLE_EVENTS);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Events & Festivals</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Schedule temple events and festivals</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Add Event</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-poppins font-medium px-2 py-0.5 rounded-full ${
                event.isActive ? "bg-teal/10 text-teal" : "bg-gray-100 text-gray-400"
              }`}>
                {event.isActive ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-teal"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="font-cinzel font-bold text-gray-800 text-base mb-2">{event.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-noto">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.date}{event.date !== event.endDate ? ` – ${event.endDate}` : ""}</span>
            </div>
            <span className="mt-3 inline-block badge-info text-xs">{event.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
