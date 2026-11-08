import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Origins come from build-time env so the same code works locally and on Netlify.
function parseUrl(url) {
  try {
    return url ? new URL(url) : null;
  } catch {
    return null;
  }
}

const apiOrigin = parseUrl(process.env.NEXT_PUBLIC_API_URL)?.origin;
const mediaUrl = parseUrl(process.env.NEXT_PUBLIC_S3_BUCKET_URL);

const sources = (...list) => list.filter(Boolean).join(" ");
const connectSrc = sources("'self'", apiOrigin, mediaUrl?.origin, "https://*.razorpay.com");
const mediaSrc = sources("'self'", mediaUrl?.origin);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...(mediaUrl
        ? [{ protocol: mediaUrl.protocol.replace(":", ""), hostname: mediaUrl.hostname, port: mediaUrl.port }]
        : []),
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://checkout.razorpay.com; connect-src ${connectSrc}; frame-src https://www.youtube.com https://*.razorpay.com https://maps.google.com https://www.google.com; img-src 'self' data: https:; media-src ${mediaSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;`,
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default withNextIntl(nextConfig);
