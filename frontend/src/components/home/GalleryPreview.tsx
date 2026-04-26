"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Camera } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";

// Placeholder gallery images for preview (in production fetched from API)
const PREVIEW_IMAGES = [
  { id: "1", src: "/images/gallery/temple-1.jpg", alt: "Temple Entrance", span: "col-span-2 row-span-2" },
  { id: "2", src: "/images/gallery/festival-1.jpg", alt: "Festival Celebrations", span: "" },
  { id: "3", src: "/images/gallery/pooja-1.jpg", alt: "Morning Pooja", span: "" },
  { id: "4", src: "/images/gallery/annadanam-1.jpg", alt: "Annadanam", span: "" },
  { id: "5", src: "/images/gallery/deity-1.jpg", alt: "Deity Decoration", span: "" },
  { id: "6", src: "/images/gallery/festival-2.jpg", alt: "Brahmotsavam", span: "" },
];

export function GalleryPreview() {
  const t = useTranslations("home.gallery");

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <SectionHeader
            title={t("title")}
            subtitle={t("subtitle")}
            align="left"
          />
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-saffron font-poppins font-semibold hover:gap-3 transition-all duration-200 shrink-0"
          >
            {t("viewAll")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px]">
          {PREVIEW_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`relative rounded-xl overflow-hidden group cursor-pointer ${image.span || ""}`}
            >
              <div className="absolute inset-0 bg-golden/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-golden/40" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-poppins font-medium">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-8">
          <Link href="/gallery" className="btn-secondary inline-flex">
            <Camera className="w-4 h-4" />
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
