"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GALLERY_CATEGORIES } from "@/lib/constants";

const SAMPLE_IMAGES = [
  { id: "1", url: "/images/gallery/placeholder-1.jpg", caption: "Temple entrance decorated", category: "temple", createdAt: "2024-07-10" },
  { id: "2", url: "/images/gallery/placeholder-2.jpg", caption: "Brahmotsavam celebrations", category: "festivals", createdAt: "2024-07-08" },
  { id: "3", url: "/images/gallery/placeholder-3.jpg", caption: "Abhishekam ceremony", category: "poojas", createdAt: "2024-07-05" },
  { id: "4", url: "/images/gallery/placeholder-4.jpg", caption: "Annadanam seva", category: "annadanam", createdAt: "2024-07-01" },
];

export default function AdminGalleryPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = SAMPLE_IMAGES.filter((img) => filterCat === "all" || img.category === filterCat);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-500 font-noto text-sm mt-1">Upload and manage photo gallery</p>
        </div>
        <Button leftIcon={<Upload className="w-4 h-4" />} size="sm" onClick={() => fileInputRef.current?.click()}>
          Upload Photos
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCat(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-poppins font-medium transition-all border ${
              filterCat === cat.id
                ? "bg-saffron text-white border-saffron"
                : "bg-white text-gray-600 border-gray-200 hover:border-saffron hover:text-saffron"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Upload zone */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center hover:border-saffron hover:bg-saffron/5 transition-all group"
        >
          <Upload className="w-6 h-6 text-gray-300 group-hover:text-saffron mb-1 transition-colors" />
          <span className="text-xs text-gray-400 group-hover:text-saffron font-poppins transition-colors">Upload</span>
        </button>

        {filtered.map((img) => (
          <div
            key={img.id}
            className={`group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer border-2 transition-all ${
              selected === img.id ? "border-saffron" : "border-transparent"
            }`}
            onClick={() => setSelected(selected === img.id ? null : img.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-xs font-noto line-clamp-2">{img.caption}</p>
            </div>
            {/* Delete button */}
            <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-3 h-3" />
            </button>
            {/* Category badge */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="badge-info text-xs px-1.5 py-0.5">{img.category}</span>
            </div>
            {/* Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-saffron/10 to-rust/10 flex items-center justify-center">
              <Tag className="w-8 h-8 text-saffron/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
