"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";
import { DEITIES } from "@/lib/constants";

export function DeitiesPreview() {
  const t = useTranslations("home.deities");

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} className="mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DEITIES.map((deity, index) => (
            <motion.div
              key={deity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={`/deities/${deity.slug}`}
                className="group flex flex-col items-center p-4 rounded-2xl hover:bg-saffron-50 border border-transparent hover:border-saffron-200 transition-all duration-300"
              >
                <div className="relative w-20 h-20 mb-3">
                  <div className="w-20 h-20 rounded-full border-4 border-golden/30 group-hover:border-saffron overflow-hidden transition-colors duration-300 bg-amber-50 flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🛕</span>
                  </div>
                  {/* Glow ring on hover */}
                  <div className="absolute inset-0 rounded-full group-hover:shadow-[0_0_20px_rgba(251,156,27,0.4)] transition-shadow duration-300" />
                </div>
                <p className="text-center text-sm font-cinzel font-semibold text-gray-700 group-hover:text-rust transition-colors leading-tight">
                  {deity.name}
                </p>
                <p className="text-center text-xs text-gray-400 mt-1 font-noto line-clamp-2">
                  {deity.shortDescription}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/deities"
            className="inline-flex items-center gap-2 text-saffron font-poppins font-semibold hover:gap-3 transition-all duration-200"
          >
            {t("viewAll")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
