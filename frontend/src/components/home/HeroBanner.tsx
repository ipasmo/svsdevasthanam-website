"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function HeroBanner() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-rust via-rust/90 to-rust/70">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to maintain text readability */}
        <div className="absolute inset-0 bg-rust/70 z-10" />
        {/* Directional gradient for better left-side contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-rust/80 via-rust/50 to-transparent z-10" />
        {/* Decorative sacred pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-sacred z-10" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-golden/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron/10 rounded-full blur-2xl" />

      <div className="container mx-auto px-4 z-10 py-20">
        <div className="max-w-3xl">
          {/* Om Symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-golden/20 border border-golden/30 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-golden font-cinzel text-lg">ॐ</span>
            <span className="text-golden/80 text-sm font-poppins">Sri Sai Ram</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4"
          >
            {t("title")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-golden font-playfair italic mb-3"
          >
            {t("subtitle")}
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 text-white/70 mb-8"
          >
            <MapPin className="w-4 h-4 text-golden" />
            <span className="font-poppins text-sm">{t("location")}</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              variant="golden"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => document.getElementById("timings")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("ctaDarshan")}
            </Button>
            <Link href="/donate">
              <Button variant="secondary" size="lg" className="border-white/50 text-white hover:bg-white hover:text-rust">
                {t("ctaDonate")}
              </Button>
            </Link>
            <Link href="/live">
              <Button variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10" leftIcon={<Play className="w-4 h-4 text-golden" />}>
                {t("ctaLive")}
              </Button>
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10"
          >
            {[
              { label: "Deities", value: "6+" },
              { label: "Daily Poojas", value: "5+" },
              { label: "Annadanam Daily", value: "200+" },
              { label: "Years of Service", value: "20+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-cinzel font-bold text-golden">{stat.value}</p>
                <p className="text-xs text-white/60 font-poppins mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 text-offwhite">
        <svg viewBox="0 0 1440 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
