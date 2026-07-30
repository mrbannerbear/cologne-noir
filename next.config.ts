import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // allow all from vercel blob
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.vercel-storage.com",
            },
        ],
    },
};

export default nextConfig;
