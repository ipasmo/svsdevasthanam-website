import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "About Sri Venkata Sai Devasthanam",
  description:
    "Learn about the history, founders, architecture, and spiritual significance of Sri Venkata Sai Devasthanam in Yemmiganur, Kurnool, Andhra Pradesh.",
};

const TIMELINE = [
  { i18nKey: "0" },
  { i18nKey: "1" },
  { i18nKey: "2" },
  { i18nKey: "3" },
  { i18nKey: "4" },
  { i18nKey: "5" },
];

export default async function AboutPage() {
  const t = await getTranslations("about");
  return (
    <div className="bg-offwhite">
      {/* Page Header */}
      <div className="bg-temple-gradient text-white py-20 clip-hero">
        <div className="container mx-auto px-4 text-center">
          <p className="font-cinzel text-golden text-sm uppercase tracking-widest mb-3">{t("tagline")}</p>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20 max-w-5xl">
        {/* Temple History */}
        <section id="history">
          <SectionHeader title={t("history")} align="left" className="mb-8" />
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="font-noto text-gray-700 leading-relaxed text-lg">
                {t("historyPara1")}
              </p>
              <p className="font-noto text-gray-700 leading-relaxed">
                {t("historyPara2")}
              </p>
              <p className="font-noto text-gray-700 leading-relaxed">
                {t("historyPara3")}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-temple-card border border-amber-100">
              <h3 className="font-cinzel font-bold text-rust mb-4">{t("glance")}</h3>
              <div className="space-y-3">
                {[
                  { labelKey: "glanceEstablished", value: "2004" },
                  { labelKey: "glanceLocation", value: "Yemmiganur, Kurnool, AP" },
                  { labelKey: "glanceMainDeity", value: "Sri Venkateshwara Swamy" },
                  { labelKey: "glanceDeities", value: "6" },
                  { labelKey: "glanceDailyVisitors", value: "100–300+" },
                  { labelKey: "glanceFestivals", value: "12+" },
                  { labelKey: "glanceAnnadanam", value: "365" },
                ].map((item) => (
                  <div key={item.labelKey} className="flex justify-between items-center py-2 border-b border-amber-50 last:border-0">
                    <span className="text-sm text-gray-500 font-poppins">{t(item.labelKey)}</span>
                    <span className="text-sm font-semibold text-rust font-poppins">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Founders */}
        <section id="founders">
          <SectionHeader title={t("founders")} align="left" className="mb-8" />
          <p className="font-noto text-gray-700 leading-relaxed text-lg mb-6">
            {t("foundersDesc")}
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["dept1", "dept2", "dept3", "dept4", "dept5"].map((deptKey) => (
              <div key={deptKey} className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center text-saffron">🏛️</div>
                <span className="font-poppins text-sm font-medium text-gray-700">{t(deptKey)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Significance */}
        <section id="significance">
          <SectionHeader title={t("significance")} align="left" className="mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🙏", titleKey: "significanceTitle1", descKey: "significanceDesc1" },
              { icon: "🍛", titleKey: "significanceTitle2", descKey: "significanceDesc2" },
              { icon: "🎭", titleKey: "significanceTitle3", descKey: "significanceDesc3" },
            ].map((item) => (
              <div key={item.titleKey} className="temple-card p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-playfair font-bold text-rust mb-3">{t(item.titleKey)}</h3>
                <p className="text-sm text-gray-600 font-noto leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture">
          <SectionHeader title={t("architecture")} align="left" className="mb-8" />
          <p className="font-noto text-gray-700 leading-relaxed text-lg">
            {t("archDesc")}
          </p>
        </section>

        {/* Timeline */}
        <section id="timeline">
          <SectionHeader title={t("timeline")} align="left" className="mb-8" />
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-200 hidden md:block" />
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="shrink-0 w-16 h-16 rounded-full bg-temple-gradient flex items-center justify-center shadow-md z-10">
                    <span className="font-cinzel font-bold text-white text-xs text-center">{t(`timeline${item.i18nKey}year`)}</span>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 flex-1">
                    <h3 className="font-playfair font-bold text-rust mb-1">{t(`timeline${item.i18nKey}event`)}</h3>
                    <p className="text-sm text-gray-600 font-noto">{t(`timeline${item.i18nKey}desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
