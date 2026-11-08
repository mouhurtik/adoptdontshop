import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import TiptapRenderer from '../community/TiptapRenderer';
import { serializeJsonLd } from '@/lib/site';

describe('Server-visible community content', () => {
    it('renders member headings, lists and text before hydration', () => {
        const html = renderToStaticMarkup(<TiptapRenderer content={{ type: 'doc', content: [
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'What helped our rescue cat?' }] },
            { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A quiet resting place' }] }] }] },
        ] }} />);
        expect(html).toContain('<h2>What helped our rescue cat?</h2>');
        expect(html).toContain('<ul><li><p>A quiet resting place</p></li></ul>');
    });

    it('escapes content and rejects executable links and image sources', () => {
        const html = renderToStaticMarkup(<TiptapRenderer content={{ type: 'doc', content: [
            { type: 'paragraph', content: [{ type: 'text', text: '<script>unsafe</script>', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] },
            { type: 'image', attrs: { src: 'data:image/svg+xml,unsafe', onerror: 'alert(1)' } },
        ] }} />);
        expect(html).toContain('&lt;script&gt;');
        expect(html).not.toContain('<script>');
        expect(html).not.toContain('javascript:');
        expect(html).not.toContain('<img');
        expect(html).not.toContain('onerror');
    });

    it('retains ordinary links with user-content relationship attributes', () => {
        const html = renderToStaticMarkup(<TiptapRenderer content={{ type: 'paragraph', content: [
            { type: 'text', text: 'Read the source', marks: [{ type: 'link', attrs: { href: 'https://example.org/source' } }] },
        ] }} />);
        expect(html).toContain('href="https://example.org/source"');
        expect(html).toContain('rel="ugc nofollow noopener noreferrer"');
    });

    it('keeps user text from closing a structured-data script', () => {
        const value = { headline: '</script><script>alert(1)</script>' };
        const json = serializeJsonLd(value);
        expect(json).not.toContain('</script>');
        expect(JSON.parse(json)).toEqual(value);
    });
});
