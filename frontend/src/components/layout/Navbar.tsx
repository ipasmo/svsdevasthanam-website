"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ─── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-rust text-white text-xs py-2 px-4 hidden md:block">
        <div className="container mx-auto flex items-center justify-between">
          <p className="font-poppins">
            🕉️ Om Sri Sai Ram · Daily Darshan: 5:30 AM – 12:00 PM & 4:00 PM – 8:30 PM
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher compact />
          </div>
        </div>
      </div>

      {/* ─── Main Navbar ──────────────────────────────────────────────────── */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white shadow-md overflow-hidden flex items-center justify-center">
              <Image
                src="/images/logo/svs_logo.svg"
                alt="Sri Venkata Sai Devasthanam Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-cinzel font-bold text-rust text-base leading-tight">
                Sri Venkata Sai
              </p>
              <p className="text-xs text-gray-500 font-poppins leading-tight">
                Temple · Yemmiganur
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-poppins font-medium transition-colors duration-150",
                      isActive(item.href)
                        ? "text-saffron"
                        : "text-gray-600 hover:text-saffron hover:bg-saffron-50"
                    )}
                  >
                    {t((item.i18nKey ?? item.label.toLowerCase()) as never)}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : item.href === "/donate" ? (
                  <Link
                    href={item.href}
                    className="btn-primary py-1.5 px-4 text-xs ml-1"
                  >
                    {t("donate")}
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-poppins font-medium transition-colors duration-150",
                      isActive(item.href)
                        ? "text-saffron bg-saffron-50"
                        : "text-gray-600 hover:text-saffron hover:bg-saffron-50"
                    )}
                  >
                    {t((item.i18nKey ?? item.label.toLowerCase()) as never)}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.href && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-lg border border-amber-100 py-2 z-50"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm font-poppins text-gray-600 hover:text-saffron hover:bg-saffron-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Language + Mobile Menu */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block lg:hidden">
              <LanguageSwitcher compact />
            </div>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-saffron hover:bg-saffron-50 transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-amber-100 bg-white overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-4 py-2.5 rounded-lg text-sm font-poppins font-medium transition-colors",
                        isActive(item.href)
                          ? "text-saffron bg-saffron-50"
                          : "text-gray-600 hover:text-saffron hover:bg-saffron-50",
                        item.href === "/donate" && "btn-primary mt-2 text-center"
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 rounded-lg text-sm text-gray-500 hover:text-saffron hover:bg-saffron-50 transition-colors"
                          >
                            › {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2 border-t border-amber-100">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
