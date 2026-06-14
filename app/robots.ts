import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/profile/',
                '/admin/',
                '/login',
                '/signup',
                '/forgot-password',
                '/reset-password',
                '/messages',
                '/settings',
                '/list-pet',
            ],
        },
        sitemap: 'https://adoptdontshop.xyz/sitemap.xml',
    };
}
