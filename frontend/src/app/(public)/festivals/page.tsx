import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Festivals & Events - Sri Venkata Sai Devasthanam",
  description:
    "Celebrate divine festivals at Sri Venkata Sai Devasthanam. Brahmotsavam, Rama Navami, Mahashivaratri, Guru Purnima, Sai Baba Aradhana, and more.",
};

const FESTIVALS = [
  {
    id: "1",
    name: "Brahmotsavam",
    month: "March / April",
    description: "The grandest annual festival of Sri Venkata Sai Devasthanam, celebrated over 9 days with special poojas, processions, cultural programs, and mass annadanam.",
    icon: "🎺",
    highlight: true,
  },
  {
    id: "2",
    name: "Rama Navami",
    month: "March / April",
    description: "Birth anniversary of Lord Rama celebrated with special poojas, Ramayana parayanam, and cultural programs.",
    icon: "🏹",
    highlight: false,
  },
  {
    id: "3",
    name: "Hanuman Jayanti",
    month: "April",
    description: "Birthday of Lord Hanuman celebrated with Sundara Kanda parayanam, special abhishekam, and devotional songs.",
    icon: "🙏",
    highlight: false,
  },
  {
    id: "4",
    name: "Sai Baba Aradhana",
    month: "October",
    description: "The divine mahanirvana day of Shirdi Sai Baba observed with special poojas, bhajans, and Sai Satcharitra parayanam.",
    icon: "⭐",
    highlight: true,
  },
  {
    id: "5",
    name: "Maha Shivaratri",
    month: "February / March",
    description: "The great night of Lord Shiva celebrated with all-night vigil, rudrabhishekam, and special poojas.",
    icon: "🌙",
    highlight: false,
  },
  {
    id: "6",
    name: "Guru Purnima",
    month: "July",
    description: "Day of gratitude to all gurus, observed with special poojas, discourses, and devotees seeking blessings.",
    icon: "✨",
    highlight: false,
  },
  {
    id: "7",
    name: "Ganesh Chaturthi",
    month: "August / September",
    description: "10-day celebration of Lord Ganesha with daily poojas, cultural programs, and grand immersion on the final day.",
    icon: "🐘",
    highlight: false,
  },
  {
    id: "8",
    name: "Navaratri",
    month: "September / October",
    description: "Nine auspicious nights dedicated to Goddess Durga, Lakshmi, and Saraswati with special daily poojas.",
    icon: "🌺",
    highlight: false,
  },
  {
    id: "9",
    name: "Deepavali",
    month: "October / November",
    description: "Festival of lights celebrated with special temple illumination, fireworks, and midnight lakshmi pooja.",
    icon: "🪔",
    highlight: false,
  },
  {
    id: "10",
    name: "Vaikunta Ekadashi",
    month: "December / January",
    description: "Sacred ekadashi dedicated to Lord Vishnu with special midnight darshan and door of liberation open for devotees.",
    icon: "🚪",
    highlight: false,
  },
  {
    id: "11",
    name: "Ugadi",
    month: "March / April",
    description: "Telugu New Year celebrated with special poojas, panchangam reading, and community celebrations.",
    icon: "🌟",
    highlight: false,
  },
  {
    id: "12",
    name: "Karthika Masa",
    month: "November",
    description: "Holy month dedicated to Lord Shiva and Vishnu, with daily diya lighting, special poojas throughout the month.",
    icon: "🕯️",
    highlight: false,
  },
];

export default async function FestivalsPage() {
  const t = await getTranslations("festivals");
  const highlighted = FESTIVALS.filter((f) => f.highlight);
  const regular = FESTIVALS.filter((f) => !f.highlight);

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
            {FESTIVALS.map((festival) => (
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
