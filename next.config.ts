import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images and potential CDN later
    remotePatterns: [],
  },
  // Serve downloads as static files
  async headers() {
    return [
      {
        source: "/downloads/:path*",
        headers: [
          {
            key: "Content-Disposition",
            value: "attachment",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
