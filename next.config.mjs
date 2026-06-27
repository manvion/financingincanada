// Opt-in low-memory build (for constrained local machines): LOW_MEM_BUILD=1
// On Vercel this is unset, so builds run at full parallelism.
const lowMem = process.env.LOW_MEM_BUILD === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    webpackMemoryOptimizations: true,
    ...(lowMem ? { cpus: 1, workerThreads: false } : {}),
  },
  images: {
    // Uploaded images are served same-origin from /api/uploads/[id] (stored in
    // Postgres) so no external image host is required. Unsplash is only used for
    // decorative stock imagery and can be removed once real assets are added.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
