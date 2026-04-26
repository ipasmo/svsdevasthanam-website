import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, Sparkles } from "lucide-react";
import { DEITIES } from "@/lib/constants";

interface DeityPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return DEITIES.map((deity) => ({ slug: deity.slug }));
}

export async function generateMetadata({ params }: DeityPageProps): Promise<Metadata> {
  const deity = DEITIES.find((d) => d.slug === params.slug);
  if (!deity) return { title: "Deity Not Found" };
  return {
    title: `${deity.name} - Sri Venkata Sai Devasthanam`,
    description: deity.description.slice(0, 160),
  };
}

export default function DeityPage({ params }: DeityPageProps) {
  const deity = DEITIES.find((d) => d.slug === params.slug);
  if (!deity) notFound();

  const otherDeities = DEITIES.filter((d) => d.slug !== params.slug).slice(0, 3);

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-temple-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/deities"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-poppins text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            All Deities
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Deity Image */}
            <div className="w-48 h-48 rounded-full border-4 border-golden bg-white/10 flex items-center justify-center shrink-0 shadow-xl">
              <span className="text-8xl">🛕</span>
            </div>
            {/* Info */}
            <div>
              <p className="text-golden font-poppins text-sm uppercase tracking-widest mb-2">Divine Deity</p>
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-3">{deity.name}</h1>
              <p className="text-white/80 font-playfair italic text-xl">{deity.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="font-cinzel font-bold text-rust text-xl mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-golden" />
                About {deity.name}
              </h2>
              <p className="font-noto text-gray-700 leading-loose text-lg">{deity.description}</p>
            </section>

            {/* Significance */}
            <section>
              <h2 className="font-cinzel font-bold text-rust text-xl mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-golden" />
                Spiritual Significance
              </h2>
              <div className="bg-golden/10 border border-golden/30 rounded-xl p-6">
                <p className="font-noto text-gray-700 leading-relaxed">{deity.significance}</p>
              </div>
            </section>

            {/* Rituals */}
            <section>
              <h2 className="font-cinzel font-bold text-rust text-xl mb-4">Associated Rituals</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
                <p className="font-noto text-gray-700 leading-relaxed">{deity.rituals}</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Seva */}
            <div className="bg-temple-gradient text-white rounded-2xl p-6 text-center">
              <p className="font-cinzel font-bold text-lg mb-2">Book a Seva</p>
              <p className="text-white/70 text-sm font-noto mb-4">
                Offer special prayers and sevas for {deity.name}
              </p>
              <Link href="/poojas" className="btn-secondary border-white/50 text-white hover:bg-white hover:text-rust block text-center py-2.5 rounded-full font-poppins font-semibold text-sm">
                View Sevas
              </Link>
            </div>

            {/* Other Deities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
              <h3 className="font-cinzel font-bold text-rust mb-4">Other Deities</h3>
              <div className="space-y-3">
                {otherDeities.map((d) => (
                  <Link
                    key={d.id}
                    href={`/deities/${d.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 text-xl border border-amber-100 group-hover:border-saffron transition-colors">
                      🛕
                    </div>
                    <div>
                      <p className="text-sm font-poppins font-semibold text-gray-700 group-hover:text-saffron transition-colors">
                        {d.name}
                      </p>
                      <p className="text-xs text-gray-400">{d.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
