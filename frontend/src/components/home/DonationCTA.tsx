"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, IndianRupee } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { DONATION_AMOUNTS, DONATION_PURPOSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function DonationCTA() {
  const t = useTranslations("donate");
  const tHome = useTranslations("home.donate");

  return (
    <section className="py-20 bg-golden/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-saffron/10 mb-6">
              <Heart className="w-8 h-8 text-saffron" />
            </div>

            <SectionHeader
              title={tHome("title")}
              subtitle={tHome("supportSubtitle")}
              className="mb-8"
            />

            {/* Quick Amount Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {DONATION_AMOUNTS.slice(0, 6).map((amount) => (
                <Link
                  key={amount}
                  href={`/donate?amount=${amount}`}
                  className="px-5 py-2.5 rounded-full border-2 border-saffron-200 text-saffron bg-white hover:bg-saffron hover:text-white hover:border-saffron font-poppins font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {formatCurrency(amount)}
                </Link>
              ))}
              <Link
                href="/donate"
                className="px-5 py-2.5 rounded-full border-2 border-dashed border-saffron-200 text-gray-500 hover:border-saffron hover:text-saffron font-poppins text-sm transition-all duration-200"
              >
                {tHome("customAmount")}
              </Link>
            </div>

            {/* Purpose Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {DONATION_PURPOSES.map((purpose) => (
                <Link
                  key={purpose.value}
                  href={`/donate?purpose=${purpose.value}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200 text-gray-600 text-xs font-poppins hover:border-saffron hover:text-saffron transition-colors"
                >
                  {t(`purpose_${purpose.value}`)}
                </Link>
              ))}
            </div>

            <Link href="/donate">
              <Button variant="primary" size="lg" leftIcon={<IndianRupee className="w-4 h-4" />}>
                {t("proceed")}
              </Button>
            </Link>

            <p className="text-xs text-gray-400 font-poppins mt-4">
              🔒 {t("tax")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
