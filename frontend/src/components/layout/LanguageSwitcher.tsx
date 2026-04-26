"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SupportedLocale } from "@/types";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const locale = useLocale() as SupportedLocale;

  const switchLocale = (newLocale: SupportedLocale) => {
    // Set locale cookie and reload so server re-reads it
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    window.location.reload();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Globe className="w-3.5 h-3.5 opacity-70" />
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={cn(
                "text-xs font-poppins font-medium px-1.5 py-0.5 rounded transition-colors",
                locale === lang.code
                  ? "text-golden font-bold"
                  : "opacity-70 hover:opacity-100"
              )}
              aria-label={`Switch to ${lang.label}`}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <div className="flex gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLocale(lang.code)}
            aria-label={`Switch to ${lang.label}`}
            className={cn(
              "flex items-center gap-1.5 text-sm font-poppins px-3 py-1.5 rounded-full border transition-all",
              locale === lang.code
                ? "border-saffron bg-saffron-50 text-saffron font-semibold"
                : "border-gray-200 text-gray-500 hover:border-saffron-200 hover:text-saffron"
            )}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
