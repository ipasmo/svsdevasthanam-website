import Link from "next/link";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Youtube, Facebook, Instagram } from "lucide-react";
import { TEMPLE_INFO, NAV_ITEMS } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-rust text-white">
      {/* ─── Om Divider ─────────────────────────────────────────────────── */}
      <div className="bg-golden/20 py-4">
        <p className="text-center font-cinzel text-golden text-lg tracking-widest">
          ॐ श्री साई राम · ॐ నమో వేంకటేశాయ · ॐ नमो वेंकटेशाय
        </p>
      </div>

      {/* ─── Main Footer ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-golden flex items-center justify-center text-rust font-cinzel font-bold text-lg">
                ॐ
              </div>
              <div>
                <p className="font-cinzel font-bold text-white">Sri Venkata Sai</p>
                <p className="text-xs text-golden/80 font-poppins">Devasthanam · Yemmiganur</p>
              </div>
            </div>
            <p className="text-sm text-white/70 font-noto leading-relaxed mb-4">
              {t("description")}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={TEMPLE_INFO.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-golden hover:text-rust transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={TEMPLE_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-golden hover:text-rust transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={TEMPLE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-golden hover:text-rust transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cinzel font-semibold text-golden mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.slice(0, 8).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 hover:text-golden font-poppins transition-colors flex items-center gap-2"
                  >
                    <span className="text-golden/40">›</span>
                    {tNav(item.i18nKey as never)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-cinzel font-semibold text-golden mb-4">{t("services")}</h3>
            <ul className="space-y-2.5">
              {(["service_dailyPoojas", "service_specialSevas", "service_annadanam", "service_festivals", "service_liveStream", "service_photoGallery", "service_donations", "service_contactUs"] as const).map(
                (key) => (
                  <li key={key}>
                    <span className="text-sm text-white/70 font-poppins flex items-center gap-2">
                      <span className="text-golden/40">›</span>
                      {t(key)}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-cinzel font-semibold text-golden mb-4">{t("contact")}</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-golden shrink-0 mt-0.5" />
                <p className="text-sm text-white/70 font-noto leading-relaxed">
                  {TEMPLE_INFO.address}
                </p>
              </div>
              <div className="space-y-2">
                {TEMPLE_INFO.phone.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-white/70 hover:text-golden transition-colors"
                  >
                    <Phone className="w-4 h-4 text-golden shrink-0" />
                    <span className="font-poppins">{phone}</span>
                  </a>
                ))}
              </div>
              <a
                href={`mailto:${TEMPLE_INFO.email}`}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-golden transition-colors"
              >
                <Mail className="w-4 h-4 text-golden shrink-0" />
                <span className="font-poppins">{TEMPLE_INFO.email}</span>
              </a>
            </div>

            {/* Temple Timings Summary */}
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs font-poppins font-semibold text-golden mb-2">
                {t("templeHours")}
              </p>
              <p className="text-xs text-white/60 font-noto">
                {t("morningHours")}
              </p>
              <p className="text-xs text-white/60 font-noto">
                {t("eveningHours")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50 font-poppins text-center">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/50 hover:text-golden transition-colors font-poppins">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="text-xs text-white/50 hover:text-golden transition-colors font-poppins">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
