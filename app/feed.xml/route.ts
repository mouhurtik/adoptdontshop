import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
    const supabase = await createServerSupabaseClient();
    const baseUrl = 'https://adoptdontshop.xyz';

    const { data: posts } = await supabase
        .from('community_posts')
        .select('title, slug, content_text, featured_image_url, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

    const items = (posts || []).map(post => {
        const description = post.content_text
            ? post.content_text.replace(/[#*_[\]<>]/g, '').substring(0, 300).trim()
            : '';
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/community/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/community/${post.slug}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      ${post.featured_image_url ? `<enclosure url="${post.featured_image_url}" type="image/jpeg" />` : ''}
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
