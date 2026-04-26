import type { Metadata } from "next";
import { Clock, Sun, Sunrise, Sunset, Star } from "lucide-react";
import { TEMPLE_TIMINGS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Temple Timings - Sri Venkata Sai Devasthanam",
  description:
    "Daily darshan and pooja timings at Sri Venkata Sai Devasthanam, Yemmiganur. Morning: 5:30 AM - 12:00 PM, Evening: 4:00 PM - 8:30 PM.",
};

export default async function TimingsPage() {
  const t = await getTranslations("timings");
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-temple-gradient text-white py-20 clip-hero">
        <div className="container mx-auto px-4 text-center">
          <Clock className="w-10 h-10 text-golden mx-auto mb-3" />
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Quick Summary */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Sunrise, label: t("morningSession"), time: "5:30 AM – 1:30 PM", color: "text-golden" },
            { icon: Sun, label: t("afternoonBreak"), time: "1:30 PM – 4:00 PM", color: "text-gray-400" },
            { icon: Sunset, label: t("eveningSession"), time: "4:00 PM – 8:30 PM", color: "text-saffron" },
          ].map((session) => (
            <div key={session.label} className="bg-white rounded-2xl p-6 shadow-temple-card text-center">
              <session.icon className={cn("w-8 h-8 mx-auto mb-3", session.color)} />
              <p className="font-poppins font-semibold text-gray-700 mb-1">{session.label}</p>
              <p className="font-cinzel font-bold text-rust">{session.time}</p>
            </div>
          ))}
        </div>

        {/* Detailed Timings */}
        <div className="bg-white rounded-3xl shadow-temple-card overflow-hidden">
          <div className="bg-temple-gradient p-6 text-center">
            <h2 className="font-cinzel font-bold text-white text-xl">{t("completeSchedule")}</h2>
            <p className="text-white/60 text-sm font-noto mt-1">{t("allDaysLabel")}</p>
          </div>
          <div className="divide-y divide-amber-50">
            {TEMPLE_TIMINGS.filter(t => t.dayType !== "WEEKEND").map((timing, index) => {
              const isBreak = timing.activity.toLowerCase().includes("closed");
              return (
                <div
                  key={timing.id}
                  className={cn(
                    "flex items-center justify-between px-8 py-5 group",
                    isBreak && "bg-gray-50",
                    !isBreak && "hover:bg-saffron-50/30 transition-colors"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full shrink-0",
                        isBreak ? "bg-gray-200" :
                        index < 3 ? "bg-golden" :
                        index >= TEMPLE_TIMINGS.length - 3 ? "bg-teal" :
                        "bg-saffron"
                      )}
                    />
                    <div>
                      <p className={cn(
                        "font-poppins font-semibold",
                        isBreak ? "text-gray-400" : "text-gray-700"
                      )}>
                        {timing.activity}
                      </p>
                      {timing.description && (
                        <p className="text-xs text-gray-400 font-noto mt-0.5">{timing.description}</p>
                      )}
                    </div>
                  </div>
                  <p className={cn(
                    "font-cinzel font-bold",
                    isBreak ? "text-gray-400" : "text-rust"
                  )}>
                    {timing.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekend Note */}
        <div className="mt-6 bg-golden/10 border border-golden/30 rounded-2xl p-5 flex items-start gap-3">
          <Star className="w-5 h-5 text-golden shrink-0 mt-0.5" />
          <div>
            <p className="font-poppins font-semibold text-rust">{t("weekendsTitle")}</p>
            <p className="text-sm text-gray-600 font-noto mt-1">
              Extended evening darshan until <strong>10:00 PM</strong>. On festival days, the temple
              may observe special timings. Please check our announcements or call us for updates.
            </p>
          </div>
        </div>

        {/* Special Days */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
          <h3 className="font-cinzel font-bold text-rust mb-4">{t("specialTitle")}</h3>
          <div className="space-y-3">
            {[
              { occasion: "Brahmotsavam", timing: "5:00 AM – 11:00 PM (all days)" },
              { occasion: "Maha Shivaratri", timing: "5:30 AM – All Night Vigil" },
              { occasion: "Vaikunta Ekadashi", timing: "Gate opens at 12:00 Midnight" },
              { occasion: "Ugadi & Major Festivals", timing: "5:00 AM – 11:00 PM" },
            ].map((item) => (
              <div key={item.occasion} className="flex items-center justify-between py-2 border-b border-amber-50 last:border-0">
                <span className="text-sm font-poppins text-gray-600">{item.occasion}</span>
                <span className="text-sm font-semibold text-rust font-poppins">{item.timing}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
