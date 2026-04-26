"use client";

import { motion } from "framer-motion";
import { Clock, CalendarDays } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";
import { TEMPLE_TIMINGS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TempleTimingsSection() {
  const t = useTranslations("timings");

  const allDayTimings = TEMPLE_TIMINGS.filter(
    (t) => t.dayType === "ALL" || t.dayType === "WEEKDAY"
  );

  const isBreak = (activity: string) => activity.toLowerCase().includes("closed") || activity.toLowerCase().includes("break");

  return (
    <section id="timings" className="py-20 bg-sacred">
      <div className="container mx-auto px-4">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} className="mb-12" />

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-temple-card overflow-hidden">
            {/* Header */}
            <div className="bg-temple-gradient p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-cinzel font-bold text-lg">{t("dailySchedule")}</span>
              </div>
              <p className="text-white/70 text-sm font-noto mt-1">{t("allDaysLabel")}</p>
            </div>

            {/* Timings List */}
            <div className="divide-y divide-amber-100">
              {allDayTimings.map((timing, index) => (
                <motion.div
                  key={timing.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={cn(
                    "flex items-center justify-between px-6 py-4",
                    isBreak(timing.activity) && "bg-red-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        isBreak(timing.activity)
                          ? "bg-gray-300"
                          : index <= 2
                          ? "bg-golden"
                          : index >= allDayTimings.length - 2
                          ? "bg-teal"
                          : "bg-saffron"
                      )}
                    />
                    <span
                      className={cn(
                        "font-poppins text-sm font-medium",
                        isBreak(timing.activity) ? "text-gray-400 italic" : "text-gray-700"
                      )}
                    >
                      {timing.activity}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-cinzel text-sm font-bold shrink-0",
                      isBreak(timing.activity) ? "text-gray-400" : "text-rust"
                    )}
                  >
                    {timing.time}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Weekend Note */}
            <div className="bg-golden/10 px-6 py-4 flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-golden shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 font-noto">
                <span className="font-semibold text-rust">{t("weekendsTitle")}:</span>{" "}
                {t("weekendsDetail")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
