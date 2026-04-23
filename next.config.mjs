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
    async headers() {
        return [
            {
                source: '/:path*.svg',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.jpg',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.jpeg',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.png',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.webp',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.gif',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.ico',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/:path*.woff2',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/llms.txt',
                headers: [
                    { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
                    { key: 'Cache-Control', value: 'public, max-age=3600' },
                ],
            },
            {
                source: '/sitemap.xml',
                headers: [
                    { key: 'Content-Type', value: 'application/xml' },
                    { key: 'Cache-Control', value: 'public, max-age=3600' },
                ],
            },
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
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
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
        formats: ['image/webp'],
    },
    poweredByHeader: false,
};

export default nextConfig;
