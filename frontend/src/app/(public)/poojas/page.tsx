import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { POOJAS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Clock, Info, IndianRupee } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Poojas & Sevas - Sri Venkata Sai Devasthanam",
  description:
    "Explore daily poojas, weekly sevas, and special rituals at Sri Venkata Sai Devasthanam. Book sevas for specific occasions and participate in sacred worship.",
};

const TYPE_CONFIG: Record<string, { label: string; colorClass: string }> = {
  DAILY: { label: "Daily", colorClass: "bg-green-100 text-green-700" },
  WEEKLY: { label: "Weekly", colorClass: "bg-blue-100 text-blue-700" },
  SPECIAL: { label: "Special", colorClass: "bg-purple-100 text-purple-700" },
};

export default async function PoojasPage() {
  const t = await getTranslations("poojas");
  const dailyPoojas = POOJAS.filter((p) => p.type === "DAILY");
  const weeklySevas = POOJAS.filter((p) => p.type === "WEEKLY");
  const specialSevas = POOJAS.filter((p) => p.type === "SPECIAL");

  const PoojaCard = ({ pooja }: { pooja: (typeof POOJAS)[0] }) => (
    <div className="temple-card p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-playfair font-bold text-rust text-lg">{pooja.name}</h3>
        <span className={cn("badge", TYPE_CONFIG[pooja.type].colorClass)}>
          {TYPE_CONFIG[pooja.type].label}
        </span>
      </div>
      <p className="text-gray-600 font-noto text-sm leading-relaxed flex-1">{pooja.description}</p>

      <div className="mt-4 space-y-2 pt-4 border-t border-amber-100">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-golden shrink-0" />
          <span className="font-poppins text-gray-600">{pooja.time}</span>
        </div>
        {pooja.cost && (
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-golden shrink-0" />
            <span className="font-poppins font-semibold text-rust">
              {formatCurrency(pooja.cost)}
            </span>
          </div>
        )}
        {pooja.notes && (
          <div className="flex items-start gap-2 text-sm">
            <Info className="w-4 h-4 text-golden shrink-0 mt-0.5" />
            <span className="font-noto text-gray-500 text-xs">{pooja.notes}</span>
          </div>
        )}
      </div>

      {pooja.cost && (
        <Link
          href={`/donate?purpose=SEVA&amount=${pooja.cost}&ref=${pooja.id}`}
          className="mt-4 btn-primary text-center text-xs py-2"
        >
          {t("bookSeva")}
        </Link>
      )}
    </div>
  );

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

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Info Banner */}
        <div className="bg-golden/10 border border-golden/30 rounded-2xl p-6 flex items-start gap-4">
          <Info className="w-5 h-5 text-golden shrink-0 mt-0.5" />
          <div>
            <p className="font-poppins font-semibold text-rust">{t("booking")}</p>
            <p className="text-sm text-gray-600 font-noto mt-1">
              For special sevas and archanas, prior booking is required. Please contact the temple
              office at{" "}
              <a href="tel:+919876543210" className="text-saffron hover:underline">
                +91 98765 43210
              </a>{" "}
              or email{" "}
              <a href="mailto:info@srivenkatasai.org" className="text-saffron hover:underline">
                info@srivenkatasai.org
              </a>
            </p>
          </div>
        </div>

        {/* Daily Poojas */}
        <section>
          <SectionHeader title={t("daily")} subtitle={t("dailySubtitle")} align="left" className="mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyPoojas.map((pooja) => <PoojaCard key={pooja.id} pooja={pooja} />)}
          </div>
        </section>

        {/* Weekly Sevas */}
        <section>
          <SectionHeader title={t("weekly")} subtitle={t("weeklySubtitle")} align="left" className="mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklySevas.map((pooja) => <PoojaCard key={pooja.id} pooja={pooja} />)}
          </div>
        </section>

        {/* Special Sevas */}
        <section>
          <SectionHeader title={t("special")} subtitle={t("specialSubtitle")} align="left" className="mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialSevas.map((pooja) => <PoojaCard key={pooja.id} pooja={pooja} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
