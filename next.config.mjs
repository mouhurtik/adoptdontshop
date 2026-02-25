// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error', 'warn'] } : false,
    },
    serverExternalPackages: ["html2canvas"],
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "framer-motion",
            "date-fns",
            "@supabase/supabase-js",
            "@supabase/ssr",
            "react-hot-toast",
            "@tanstack/react-query",
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/pm",
            "@tiptap/extension-image",
            "@tiptap/extension-link",
            "@tiptap/extension-placeholder",
        ],
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
