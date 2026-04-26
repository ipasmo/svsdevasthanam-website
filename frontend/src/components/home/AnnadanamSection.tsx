"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Leaf, Users, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

export function AnnadanamSection() {
  const t = useTranslations("annadanam");

  const stats = [
    { icon: Users, label: t("daily"), value: "200+" },
    { icon: Leaf, label: t("days"), value: "365" },
    { icon: Heart, label: t("years"), value: "20+" },
  ];

  return (
    <section className="py-20 bg-rust text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 bg-sacred" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-golden/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-golden/20 border border-golden/30 rounded-full px-4 py-1.5 mb-6">
              <Leaf className="w-4 h-4 text-golden" />
              <span className="text-golden text-sm font-poppins font-semibold">
                अन्नं ब्रह्म · Food is God
              </span>
            </div>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-4">
              {t("title")}
            </h2>
            <div className="w-20 h-1 bg-golden rounded-full mb-6" />
            <p className="text-white/80 font-noto leading-relaxed text-lg mb-8">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/donate?purpose=ANNADANAM">
                <Button variant="golden" size="lg">
                  {t("sponsor")}
                </Button>
              </Link>
              <Link href="/annadanam">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  {t("learnMore")}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center"
              >
                <stat.icon className="w-6 h-6 text-golden mx-auto mb-3" />
                <p className="text-3xl font-cinzel font-bold text-golden">{stat.value}</p>
                <p className="text-xs text-white/60 font-poppins mt-1">{stat.label}</p>
              </motion.div>
            ))}

            {/* Sponsorship Call-out */}
            <div className="col-span-3 bg-golden/15 border border-golden/30 rounded-2xl p-5">
              <p className="text-center font-poppins text-sm text-white/80 mb-3">
                {t("sponsorNote")}
              </p>
              <div className="flex justify-center flex-wrap gap-2">
                {[1000, 2500, 5000, 10000].map((amount) => (
                  <Link
                    key={amount}
                    href={`/donate?purpose=ANNADANAM&amount=${amount}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-golden hover:text-rust text-white text-xs font-poppins font-semibold rounded-full border border-white/20 hover:border-golden transition-all duration-200"
                  >
                    {formatCurrency(amount)}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
