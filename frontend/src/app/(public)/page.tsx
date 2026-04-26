import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroBanner } from "@/components/home/HeroBanner";
import { DeitiesPreview } from "@/components/home/DeitiesPreview";
import { TempleTimingsSection } from "@/components/home/TempleTimingsSection";
import { AnnadanamSection } from "@/components/home/AnnadanamSection";
import { DonationCTA } from "@/components/home/DonationCTA";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { LiveStreamSection } from "@/components/home/LiveStreamSection";

export const metadata: Metadata = {
  title: "Sri Venkata Sai Devasthanam - Yemmiganur | Home",
  description:
    "Welcome to Sri Venkata Sai Devasthanam, Yemmiganur. A sacred Hindu temple dedicated to Lord Sri Venkateshwara Swamy, Sai Baba, Lord Hanuman, and more. Experience divine grace, daily poojas, festivals, and annadanam.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroBanner />

      {/* Welcome Message */}
      <section className="py-16 bg-offwhite">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-golden" />
            <span className="text-golden font-cinzel text-lg">ॐ</span>
            <span className="w-12 h-px bg-golden" />
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl text-rust font-semibold italic mb-4">
            "Wherever the name of Rama is sung, Hanuman stands witness."
          </h2>
          <p className="font-noto text-gray-600 leading-relaxed text-lg">
            Sri Venkata Sai Devasthanam in Yemmiganur, Kurnool is a beloved place of worship
            serving the spiritual needs of the local community and pilgrims. Our temple is
            dedicated to Lord Sri Venkateshwara Swamy, Sai Baba, and a host of sacred
            deities. We welcome all with open hearts — come experience peace, devotion,
            and divine grace.
          </p>
          <div className="flex justify-center mt-6 gap-8 flex-wrap">
            {[
              { label: "Est.", value: "2004" },
              { label: "Weekly Devotees", value: "1000+" },
              { label: "Daily Poojas", value: "5+" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-cinzel text-2xl font-bold text-rust">{item.value}</p>
                <p className="text-xs text-gray-400 font-poppins mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deities Preview */}
      <DeitiesPreview />

      {/* Temple Timings */}
      <TempleTimingsSection />

      {/* Gallery Preview */}
      <GalleryPreview />

      {/* Live Stream */}
      <LiveStreamSection />

      {/* Annadanam */}
      <AnnadanamSection />

      {/* Donation CTA */}
      <DonationCTA />
    </>
  );
}
