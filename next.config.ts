import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    // Server Actions default to a 1MB request body cap; image uploads
    // (uploadMediaAction) go through a Server Action and need headroom above
    // the app's own 8MB file-size check (src/lib/actions/media.ts).
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
