"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Filter } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Placeholder images — in production, fetched from API
const GALLERY_IMAGES = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  category: GALLERY_CATEGORIES[((i % 4) + 1)].slug,
  captionIndex: i + 1,
  aspectRatio: i % 3 === 0 ? "square" : i % 3 === 1 ? "landscape" : "portrait",
}));

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-temple-gradient text-white py-20 clip-hero">
        <div className="container mx-auto px-4 text-center">
          <p className="font-cinzel text-golden text-sm uppercase tracking-widest mb-3">{t("tagline")}</p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex items-center gap-3 flex-wrap mb-10">
          <Filter className="w-4 h-4 text-gray-400" />
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-poppins font-medium transition-all duration-200",
                activeCategory === cat.slug
                  ? "bg-saffron text-white shadow-md"
                  : "bg-white border border-amber-200 text-gray-600 hover:border-saffron hover:text-saffron"
              )}
            >
              {t(`category_${cat.slug}`)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <AnimatePresence>
            {filtered.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={cn(
                  "relative rounded-xl overflow-hidden cursor-pointer group bg-golden/10",
                  image.aspectRatio === "square" ? "aspect-square" :
                  image.aspectRatio === "landscape" ? "aspect-video" :
                  "aspect-[3/4]"
                )}
                onClick={() => setLightboxIndex(index)}
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-golden/30" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-3">
                    <Camera className="w-6 h-6 mx-auto mb-1" />
                    <p className="text-xs font-poppins">{t("sacredMoment")} {image.captionIndex}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-poppins">{t("noImages")}</p>
          </div>
        )}

        {/* Load More */}
        {filtered.length >= 20 && (
          <div className="text-center mt-8">
            <button className="btn-secondary">{t("loadMore")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
