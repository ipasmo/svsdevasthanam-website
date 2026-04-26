"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Radio, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { TEMPLE_INFO } from "@/lib/constants";
import { useTranslations } from "next-intl";

const LIVE_EMBED_URL = `https://www.youtube.com/embed/live_stream?channel=${process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ?? "UCxxxxxxxxxxxx"}&autoplay=0`;

export function LiveStreamSection() {
  const t = useTranslations("live");
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ?? "";

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-poppins font-semibold uppercase tracking-wider">
                {t("title")}
              </span>
            </div>
            <h2 className="font-cinzel text-3xl font-bold text-white">{t("watchTitle")}</h2>
            <p className="text-white/50 font-noto mt-1">
              {t("subtitle")}
            </p>
          </div>
          <Link href="/live">
            <Button
              variant="secondary"
              className="border-white/30 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/50"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {t("fullPage")}
            </Button>
          </Link>
        </div>

        {/* YouTube Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-black max-w-4xl mx-auto"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            src={LIVE_EMBED_URL}
            title="Sri Venkata Sai Devasthanam Live Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>

        {/* Subscribe Link */}
        <div className="text-center mt-8">
          <a
            href={TEMPLE_INFO.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-poppins font-semibold transition-colors"
          >
            <Play className="w-4 h-4" />
            Subscribe to our YouTube Channel
          </a>
        </div>
      </div>
    </section>
  );
}
