// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    experimental: {
        inlineCss: true,
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.supabase.co",
            },
        ],
        loader: "custom",
        loaderFile: "./lib/imageLoader.ts",
        minimumCacheTTL: 31536000,
    },
};

export default nextConfig;
