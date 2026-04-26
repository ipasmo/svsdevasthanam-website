import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Heart, Users, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Annadanam - Sri Venkata Sai Devasthanam",
  description:
    "Sri Venkata Sai Devasthanam's Annadanam program provides free meals daily. Sponsor a day of Annadanam and receive divine blessings.",
};

const AMOUNTS = [
  { amount: 1000, descKey: "amount0desc" },
  { amount: 2500, descKey: "amount1desc" },
  { amount: 5000, descKey: "amount2desc" },
  { amount: 10000, descKey: "amount3desc" },
  { amount: 25000, descKey: "amount4desc" },
  { amount: 50000, descKey: "amount5desc" },
];

export default async function AnnadanamPage() {
  const t = await getTranslations("annadanam");
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-rust text-white py-20 clip-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-sacred" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-golden/20 border border-golden/30 rounded-full px-4 py-1.5 mb-4">
            <Leaf className="w-4 h-4 text-golden" />
            <span className="text-golden text-sm font-poppins font-semibold">अन्नं ब्रह्म</span>
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16">
        {/* What is Annadanam */}
        <section>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-cinzel text-3xl font-bold text-rust mb-4">{t("whatTitle")}</h2>
              <div className="w-16 h-1 bg-golden rounded-full mb-6" />
              <div className="space-y-4 font-noto text-gray-700 leading-relaxed text-lg">
                <p>{t("whatPara1")}</p>
                <p>{t("whatPara2")}</p>
                <p>{t("whatPara3")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, labelKey: "statDailyBeneficiaries", value: "200+" },
                { icon: Calendar, labelKey: "statDaysPerYear", value: "365" },
                { icon: Heart, labelKey: "statYearsOfService", value: "15+" },
                { icon: Leaf, labelKey: "statMealsServed", value: "10L+" },
              ].map((stat) => (
                <div key={stat.labelKey} className="bg-white rounded-2xl p-6 shadow-temple-card text-center">
                  <stat.icon className="w-8 h-8 text-saffron mx-auto mb-3" />
                  <p className="font-cinzel text-3xl font-bold text-rust">{stat.value}</p>
                  <p className="text-xs text-gray-400 font-poppins mt-1">{t(stat.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsorship */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-cinzel text-3xl font-bold text-rust mb-3">{t("sponsorTitle")}</h2>
            <div className="w-16 h-1 bg-golden rounded-full mx-auto mb-4" />
            <p className="text-gray-500 font-noto max-w-2xl mx-auto">
              {t("sponsorNote")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {AMOUNTS.map((tier) => (
              <div
                key={tier.amount}
                className="bg-white rounded-2xl p-6 shadow-temple-card border-2 border-transparent hover:border-saffron transition-all duration-200 text-center"
              >
                <p className="font-cinzel text-2xl font-bold text-rust mb-1">
                  {formatCurrency(tier.amount)}
                </p>
                <p className="text-sm text-gray-500 font-noto mb-4">{t(tier.descKey)}</p>
                <Link
                  href={`/donate?purpose=ANNADANAM&amount=${tier.amount}`}
                  className="btn-primary w-full text-center text-sm py-2.5"
                >
                  {t("sponsorNow")}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-golden/10 rounded-2xl p-8">
          <h2 className="font-cinzel text-2xl font-bold text-rust mb-6 text-center">{t("howTitle")}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", titleKey: "step1Title", descKey: "step1Desc" },
              { step: "2", titleKey: "step2Title", descKey: "step2Desc" },
              { step: "3", titleKey: "step3Title", descKey: "step3Desc" },
              { step: "4", titleKey: "step4Title", descKey: "step4Desc" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-saffron text-white font-cinzel font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-poppins font-semibold text-gray-700 mb-1">{t(item.titleKey)}</h3>
                <p className="text-xs text-gray-500 font-noto">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
