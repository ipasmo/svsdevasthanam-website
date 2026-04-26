import type { Metadata } from "next";
import { Bell, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "News & Announcements - Sri Venkata Sai Devasthanam",
  description: "Latest news and announcements from Sri Venkata Sai Devasthanam, Yemmiganur.",
};

// Static placeholder announcements — in production fetched from API
const ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Brahmotsavam 2026 — Dates Announced",
    content: "We are pleased to announce that the grand Brahmotsavam of Sri Venkata Sai Devasthanam will be celebrated from April 10th to 18th, 2026. Special sevas and cultural programs will be organized throughout the 9-day festival. All devotees are cordially invited.",
    isImportant: true,
    createdAt: "2026-01-15T10:00:00Z",
    category: "Festival",
  },
  {
    id: "2",
    title: "Maha Shivaratri Special Arrangements",
    content: "On the occasion of Maha Shivaratri on February 26, 2026, the temple will remain open throughout the night. Special Rudrabhishekam will be performed at 12:00 Midnight. Free prasadam will be distributed to all devotees.",
    isImportant: true,
    createdAt: "2026-01-20T10:00:00Z",
    category: "Festival",
  },
  {
    id: "3",
    title: "New Seva — Sahasranama Archana Added",
    content: "We are happy to introduce Sahasranama Archana as a new seva offering. Devotees can now book this special service for ₹501. Available on all days, advance booking required.",
    isImportant: false,
    createdAt: "2026-01-10T10:00:00Z",
    category: "Seva",
  },
  {
    id: "4",
    title: "Temple Renovation Work — Nov 2025",
    content: "The hall renovation work has been successfully completed. We thank all donors who contributed to this project. The renovated hall can now accommodate 300+ devotees during special occasions.",
    isImportant: false,
    createdAt: "2025-11-30T10:00:00Z",
    category: "Announcement",
  },
  {
    id: "5",
    title: "Annadanam Milestone — 1 Lakh Meals Served",
    content: "By the grace of Lord Sri Venkateshwara Swamy and Sai Baba, our Annadanam program has served 1 Lakh (100,000) meals since its inception in 2010. We thank all our generous donors and seva volunteers.",
    isImportant: false,
    createdAt: "2025-10-25T10:00:00Z",
    category: "Milestone",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Festival: "bg-saffron-100 text-saffron",
  Seva: "bg-teal/10 text-teal",
  Announcement: "bg-blue-100 text-blue-600",
  Milestone: "bg-golden/20 text-golden-600",
};

export default async function NewsPage() {
  const t = await getTranslations("news");
  const important = ANNOUNCEMENTS.filter((a) => a.isImportant);
  const regular = ANNOUNCEMENTS.filter((a) => !a.isImportant);

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-temple-gradient text-white py-20 clip-hero">
        <div className="container mx-auto px-4 text-center">
          <Bell className="w-10 h-10 text-golden mx-auto mb-3" />
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Important Announcements */}
        {important.length > 0 && (
          <section className="mb-12">
            <h2 className="font-cinzel font-bold text-rust text-xl mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-golden" />
              {t("importantTitle")}
            </h2>
            <div className="space-y-4">
              {important.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-temple-card border-l-4 border-golden"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`badge ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {item.category}
                      </span>
                      <span className="badge bg-red-100 text-red-600">{t("important")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-poppins">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <h3 className="font-playfair font-bold text-rust text-lg mb-2">{item.title}</h3>
                  <p className="font-noto text-gray-600 text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Announcements */}
        <section>
          <h2 className="font-cinzel font-bold text-rust text-xl mb-6">{t("allUpdates")}</h2>
          <div className="space-y-4">
            {ANNOUNCEMENTS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 hover:shadow-temple-card transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className={`badge ${CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-poppins">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <h3 className="font-playfair font-bold text-rust text-lg mb-2">{item.title}</h3>
                <p className="font-noto text-gray-600 text-sm leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
