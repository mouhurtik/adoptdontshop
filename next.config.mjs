// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    async redirects() {
        return [
            { source: '/sponsors', destination: '/about?tab=patrons', permanent: true },
            { source: '/resources', destination: '/about?tab=store', permanent: true },
            { source: '/pet-essentials', destination: '/about?tab=store', permanent: true },
            { source: '/community', destination: '/', permanent: true },
        ];
    },
    async headers() {
        return [
            // Only hashed Next.js assets get immutable — public files like
            // /favicon.ico, /og-image.webp, /images/hero-dogs.webp are mutable (DEBT PERF-8)
            {
                source: '/favicon.ico',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
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
            {
                source: '/_next/static/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            // Hardening headers (CSP in report-only first to avoid breaking TipTap/GTM — SEC-8)
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    {
                        key: 'Content-Security-Policy-Report-Only',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.supabase.co",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: blob: https://*.supabase.co https://www.google-analytics.com",
                            "font-src 'self' data:",
                            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
                            "frame-ancestors 'none'",
                        ].join('; '),
                    },
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
