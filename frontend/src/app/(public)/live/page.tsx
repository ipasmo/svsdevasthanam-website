import type { Metadata } from "next";
import { Radio, Play, ExternalLink } from "lucide-react";
import { TEMPLE_INFO } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Live Stream - Sri Venkata Sai Devasthanam",
  description:
    "Watch live poojas and ceremonies from Sri Venkata Sai Devasthanam, Yemmiganur on YouTube.",
};

const PAST_STREAMS = [
  { id: "1", title: "Brahmotsavam Day 1 - 2024", youtubeId: "dQw4w9WgXcQ" },
  { id: "2", title: "Sai Baba Aradhana 2024", youtubeId: "dQw4w9WgXcQ" },
  { id: "3", title: "Maha Shivaratri 2025 - Rudrabhishekam", youtubeId: "dQw4w9WgXcQ" },
  { id: "4", title: "Ganesh Chaturthi 2024 - Day 10", youtubeId: "dQw4w9WgXcQ" },
];

export default async function LivePage() {
  const t = await getTranslations("live");
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ?? "UCxxxxxxxxxxxx";
  const liveStreamId = process.env.NEXT_PUBLIC_YOUTUBE_LIVE_STREAM_ID ?? "live_stream";
  const liveEmbedUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=0&rel=0`;

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-4">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-red-400 text-sm font-poppins font-semibold uppercase tracking-wider">
              {t("liveNow")}
            </span>
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/50 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Live Player */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-12">
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={liveEmbedUrl}
              title="Sri Venkata Sai Devasthanam Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="bg-gray-900 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-cinzel font-bold text-white">Sri Venkata Sai Devasthanam — Live</p>
              <p className="text-white/50 text-xs font-poppins">Yemmiganur, Kurnool, Andhra Pradesh</p>
            </div>
            <a
              href={TEMPLE_INFO.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-poppins font-semibold transition-colors"
            >
              <Play className="w-4 h-4" />
              Subscribe on YouTube
            </a>
          </div>
        </div>

        {/* Live Schedule */}
        <div className="bg-white rounded-2xl p-6 shadow-temple-card mb-10">
          <h2 className="font-cinzel font-bold text-rust text-xl mb-4">{t("schedule")}</h2>
          <div className="space-y-3">
            {[
              { day: "Daily", time: "5:30 AM", event: "Morning Abhishekam & Poojas" },
              { day: "Daily", time: "7:00 PM", event: "Evening Archana & Aarti" },
              { day: "Thursdays", time: "6:00 PM", event: "Sai Baba Special Pooja" },
              { day: "Sundays", time: "10:00 AM", event: "Kalyanam Seva" },
              { day: "Festival Days", time: "All Day", event: "Special Festival Celebrations" },
            ].map((item) => (
              <div
                key={item.event}
                className="flex items-center justify-between py-3 border-b border-amber-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-saffron" />
                  <span className="font-poppins font-medium text-gray-700 text-sm">{item.event}</span>
                </div>
                <div className="text-right">
                  <p className="font-cinzel font-bold text-rust text-sm">{item.time}</p>
                  <p className="text-xs text-gray-400 font-poppins">{item.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Streams */}
        <div>
          <h2 className="font-cinzel font-bold text-rust text-2xl mb-6">{t("pastStreams")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PAST_STREAMS.map((stream) => (
              <a
                key={stream.id}
                href={`https://www.youtube.com/watch?v=${stream.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-temple-card hover:border-saffron-200 transition-all duration-200"
              >
                <div className="bg-gray-800 aspect-video flex items-center justify-center relative">
                  <Play className="w-10 h-10 text-white/50 group-hover:text-white transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-poppins rounded px-2 py-0.5">
                    <ExternalLink className="w-3 h-3 inline mr-1" />
                    YouTube
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-poppins font-semibold text-gray-700 text-sm group-hover:text-saffron transition-colors">
                    {stream.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
