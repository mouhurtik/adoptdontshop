'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface TiptapRendererProps {
    content: Record<string, unknown>;
}

const TiptapRenderer = ({ content }: TiptapRendererProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                link: false,
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-2xl max-w-full mx-auto my-4' },
            }),
            Link.configure({
                openOnClick: true,
                HTMLAttributes: { class: 'text-playful-teal underline hover:text-teal-700' },
            }),
        ],
        content,
        editable: false,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none',
            },
        },
    });

    if (!editor) return null;

    return <EditorContent editor={editor} />;
};

export default TiptapRenderer;
