import { createPublicSupabaseClient } from '@/lib/supabase/server';

/** Escape text for safe interpolation into XML element/attribute positions. */
function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** Escape text for a CDATA section (a literal `]]>` would terminate it early). */
function escapeCdata(value: string): string {
    return value.replace(/\]\]>/g, ']]&gt;');
}

export async function GET() {
    const supabase = createPublicSupabaseClient();
    const baseUrl = 'https://adoptdontshop.xyz';

    const { data: posts } = supabase
        ? await supabase
              .from('community_posts')
              .select('title, slug, content_text, featured_image_url, created_at')
              .eq('status', 'published')
              .order('created_at', { ascending: false })
              .limit(50)
        : { data: null };

    const items = (posts || []).map(post => {
        const description = post.content_text
            ? post.content_text.replace(/[#*_[\]<>]/g, '').substring(0, 300).trim()
            : '';
        // Only emit enclosures for https URLs on our storage host
        let enclosure = '';
        if (
            post.featured_image_url &&
            post.featured_image_url.startsWith('https://') &&
            post.featured_image_url.includes('.supabase.co/storage/')
        ) {
            enclosure = `<enclosure url="${escapeXml(post.featured_image_url)}" type="image/jpeg" />`;
        }
        return `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${baseUrl}/community/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${baseUrl}/community/${encodeURIComponent(post.slug)}</guid>
      <description><![CDATA[${escapeCdata(description)}]]></description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      ${enclosure}
    </item>`;
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AdoptDontShop Community</title>
    <link>${baseUrl}/community</link>
    <description>Pet adoption stories, care tips, and community posts from AdoptDontShop.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
