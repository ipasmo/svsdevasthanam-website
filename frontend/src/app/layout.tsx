import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.srivenkatasai.org"),
  title: {
    template: "%s | Sri Venkata Sai Devasthanam",
    default: "Sri Venkata Sai Devasthanam - Yemmiganur, Kurnool, Andhra Pradesh",
  },
  description:
    "Sri Venkata Sai Devasthanam is a sacred Hindu temple located in Yemmiganur, Kurnool District, Andhra Pradesh. Dedicated to Lord Sri Venkateshwara Swamy, Sai Baba, and other deities.",
  keywords: [
    "Sri Venkata Sai Devasthanam",
    "Yemmiganur temple",
    "Sai Baba Temple Yemmiganur",
    "Venkateshwara Temple Kurnool",
    "Hindu temple Andhra Pradesh",
    "Yemmiganur Kurnool",
  ],
  authors: [{ name: "Sri Venkata Sai Devasthanam" }],
  creator: "Sri Venkata Sai Devasthanam",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.srivenkatasai.org",
    siteName: "Sri Venkata Sai Devasthanam",
    title: "Sri Venkata Sai Devasthanam - Yemmiganur",
    description:
      "A sacred Hindu temple in Yemmiganur, Kurnool, Andhra Pradesh. Experience divine grace and spiritual peace.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Venkata Sai Devasthanam, Yemmiganur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Venkata Sai Devasthanam - Yemmiganur",
    description: "A sacred Hindu temple in Yemmiganur, Kurnool, Andhra Pradesh.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FB9C1B",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HinduTemple",
              name: "Sri Venkata Sai Devasthanam",
              description:
                "Sacred Hindu temple in Yemmiganur, dedicated to Lord Sri Venkateshwara Swamy and Sai Baba",
              url: "https://www.srivenkatasai.org",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Yemmiganur",
                addressLocality: "Kurnool",
                addressRegion: "Andhra Pradesh",
                postalCode: "518 360",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 15.7654,
                longitude: 78.0061,
              },
              openingHours: ["Mo-Su 05:30-13:30", "Mo-Su 16:00-20:30"],
              telephone: "+91-98765-43210",
            }),
          }}
        />
      </head>
      <body className={`font-noto ${locale === "te" ? "lang-te" : ""}`}>
        <QueryProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#fff",
                    color: "#374151",
                    borderRadius: "12px",
                    border: "1px solid #fddba3",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: { primary: "#11AD99", secondary: "#fff" },
                  },
                  error: {
                    iconTheme: { primary: "#C83A00", secondary: "#fff" },
                  },
                }}
              />
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
