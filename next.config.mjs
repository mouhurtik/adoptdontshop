// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            { source: '/sponsors', destination: '/about?tab=patrons', permanent: true },
            { source: '/resources', destination: '/about?tab=store', permanent: true },
            { source: '/pet-essentials', destination: '/about?tab=store', permanent: true },
        ];
    },
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
