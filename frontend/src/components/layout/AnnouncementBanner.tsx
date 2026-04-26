"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import type { Announcement } from "@/types";

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const importantAnnouncements = announcements.filter((a) => a.isImportant);

  useEffect(() => {
    if (importantAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % importantAnnouncements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [importantAnnouncements.length]);

  if (dismissed || importantAnnouncements.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-golden text-rust overflow-hidden"
      >
        <div className="container mx-auto px-4 h-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bell className="w-4 h-4 shrink-0" />
            <AnimatePresence mode="wait">
              <motion.p
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-poppins font-semibold truncate"
              >
                {importantAnnouncements[current]?.title}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 rounded hover:bg-rust/10 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
