import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEITIES } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Temple Deities - Sri Venkata Sai Devasthanam",
  description:
    "Learn about the presiding deities of Sri Venkata Sai Devasthanam - Sri Vigneshwara, Hanuman, Sai Baba, Venkateshwara, Lord Shiva, and Nava Graha.",
};

export default async function DeitiesPage() {
  const t = await getTranslations("deities");
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

      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEITIES.map((deity) => (
            <Link key={deity.id} href={`/deities/${deity.slug}`}>
              <article className="temple-card group cursor-pointer h-full">
                {/* Deity Image Placeholder */}
                <div className="bg-golden/10 h-56 flex items-center justify-center relative overflow-hidden">
                  <div className="text-7xl group-hover:scale-110 transition-transform duration-300">🛕</div>
                  <div className="absolute inset-0 bg-temple-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="font-cinzel font-bold text-rust text-lg mb-1 group-hover:text-saffron transition-colors">
                    {deity.name}
                  </h2>
                  <p className="text-saffron font-poppins text-xs font-semibold mb-3">
                    {deity.shortDescription}
                  </p>
                  <p className="text-gray-600 font-noto text-sm leading-relaxed line-clamp-3">
                    {deity.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-saffron font-poppins text-sm font-semibold group-hover:gap-3 transition-all duration-200">
                    {t("knowMore")} <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
