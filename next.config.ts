import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Allow the Strapi admin panel to embed this app in an iframe for Preview
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${strapiUrl}`,
          },
        ],
      },
    ];
  },
};
const withNextIntl = createNextIntlPlugin("./src/libs/i18n/request.ts");
export default withNextIntl(nextConfig);
