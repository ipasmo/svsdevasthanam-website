import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getFestivals } from "@/lib/content";

export const metadata: Metadata = {
  title: "Festivals & Events - Sri Venkata Sai Devasthanam",
  description:
    "Celebrate divine festivals at Sri Venkata Sai Devasthanam. Brahmotsavam, Rama Navami, Mahashivaratri, Guru Purnima, Sai Baba Aradhana, and more.",
};

export default async function FestivalsPage() {
  const t = await getTranslations("festivals");
  const festivals = await getFestivals(await getLocale());
  const highlighted = festivals.filter((f) => f.highlight);
  const regular = festivals.filter((f) => !f.highlight);

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

      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Featured Festivals */}
        <section>
          <SectionHeader title={t("majorTitle")} subtitle={t("majorSubtitle")} align="left" className="mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            {highlighted.map((festival) => (
              <div key={festival.id} className="bg-white rounded-2xl overflow-hidden shadow-temple-card border-l-4 border-saffron">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{festival.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-cinzel font-bold text-rust text-xl">{festival.name}</h3>
                        <span className="badge bg-saffron-100 text-saffron">{festival.month}</span>
                      </div>
                      <p className="text-gray-600 font-noto text-sm leading-relaxed">{festival.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Festivals Calendar */}
        <section>
          <SectionHeader title={t("calendarTitle")} subtitle={t("calendarSubtitle")} align="left" className="mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {festivals.map((festival) => (
              <div
                key={festival.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 hover:border-saffron hover:shadow-temple-card transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{festival.icon}</span>
                  <div>
                    <h3 className="font-poppins font-semibold text-gray-700 text-sm group-hover:text-rust transition-colors">
                      {festival.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span className="font-poppins">{festival.month}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-noto leading-relaxed line-clamp-3">
                  {festival.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Notification CTA */}
        <div className="bg-temple-gradient text-white rounded-2xl p-8 text-center">
          <h3 className="font-cinzel text-2xl font-bold mb-2">{t("neverMiss")}</h3>
          <p className="text-white/70 font-noto text-sm mb-6">
            {t("subscribeNote")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary border-white/50 text-white hover:bg-white hover:text-rust"
            >
              📱 {t("whatsAppBtn")}
            </a>
            <Link href="/live" className="btn-secondary border-white/50 text-white hover:bg-white hover:text-rust">
              📺 {t("youTubeBtn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
