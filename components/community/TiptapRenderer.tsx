import { createElement, Fragment, type ReactNode } from 'react';
import { SITE_URL } from '@/lib/site';

interface RichNode {
    type?: string;
    text?: string;
    attrs?: Record<string, unknown>;
    marks?: { type?: string; attrs?: Record<string, unknown> }[];
    content?: RichNode[];
}

function safeUrl(value: unknown, image = false): string | undefined {
    if (typeof value !== 'string' || !value.trim()) return undefined;
    try {
        const url = new URL(value, SITE_URL);
        if (['https:', 'http:'].includes(url.protocol) || (!image && url.protocol === 'mailto:')) return url.href;
    } catch { /* Ignore malformed user-supplied URLs. */ }
    return undefined;
}

function renderNode(node: RichNode, key: string, depth = 0): ReactNode {
    if (!node || typeof node !== 'object' || depth > 32) return null;
    const children = Array.isArray(node.content)
        ? node.content.map((child, index) => renderNode(child, `${key}-${index}`, depth + 1))
        : null;
    if (node.type === 'text') {
        let text: ReactNode = typeof node.text === 'string' ? node.text : '';
        for (const [index, mark] of (Array.isArray(node.marks) ? node.marks : []).entries()) {
            if (!mark || typeof mark !== 'object') continue;
            const markKey = `${key}-mark-${index}`;
            if (mark.type === 'bold') text = <strong key={markKey}>{text}</strong>;
            else if (mark.type === 'italic') text = <em key={markKey}>{text}</em>;
            else if (mark.type === 'strike') text = <s key={markKey}>{text}</s>;
            else if (mark.type === 'code') text = <code key={markKey}>{text}</code>;
            else if (mark.type === 'link') {
                const href = safeUrl(mark.attrs?.href);
                if (href) text = <a key={markKey} href={href} rel="ugc nofollow noopener noreferrer" className="text-playful-teal-text underline">{text}</a>;
            }
        }
        return <Fragment key={key}>{text}</Fragment>;
    }
    switch (node.type) {
        case 'paragraph': return <p key={key}>{children}</p>;
        case 'heading': return createElement(node.attrs?.level === 3 ? 'h3' : 'h2', { key }, children);
        case 'bulletList': return <ul key={key}>{children}</ul>;
        case 'orderedList': return <ol key={key} start={typeof node.attrs?.start === 'number' ? node.attrs.start : undefined}>{children}</ol>;
        case 'listItem': return <li key={key}>{children}</li>;
        case 'blockquote': return <blockquote key={key}>{children}</blockquote>;
        case 'codeBlock': return <pre key={key}><code>{children}</code></pre>;
        case 'hardBreak': return <br key={key} />;
        case 'horizontalRule': return <hr key={key} />;
        case 'image': {
            const src = safeUrl(node.attrs?.src, true);
            return src ? <img key={key} src={src} alt={typeof node.attrs?.alt === 'string' ? node.attrs.alt : ''} loading="lazy" className="mx-auto my-4 max-w-full rounded-2xl" /> : null;
        }
        default: return <Fragment key={key}>{children}</Fragment>;
    }
}

// Render the read-only document as HTML on the server too. No editor runtime or raw HTML.
export default function TiptapRenderer({ content }: { content: Record<string, unknown> }) {
    return <div className="prose prose-lg max-w-none">{renderNode(content as RichNode, 'document')}</div>;
}
