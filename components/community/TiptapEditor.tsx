'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Heading2, Heading3, List, ListOrdered,
    Quote, ImageIcon, LinkIcon, Undo, Redo
} from 'lucide-react';
import { useCallback } from 'react';

interface TiptapEditorProps {
    content?: Record<string, unknown>;
    onChange?: (json: Record<string, unknown>, text: string) => void;
    placeholder?: string;
}

const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded-lg transition-all duration-200 ${isActive
            ? 'bg-playful-coral text-white shadow-sm'
            : 'text-gray-500 hover:bg-playful-cream hover:text-playful-text'
            }`}
    >
        {children}
    </button>
);

const TiptapEditor = ({ content, onChange, placeholder = 'Start writing your story...' }: TiptapEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-2xl max-w-full mx-auto my-4' },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-playful-teal underline hover:text-teal-700' },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] px-6 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON() as Record<string, unknown>, editor.getText());
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="bg-white rounded-[2rem] border-2 border-gray-100 shadow-soft overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-gray-100 bg-playful-cream/30">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <MenuButton onClick={addImage} title="Insert Image">
                    <ImageIcon className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={addLink}
                    isActive={editor.isActive('link')}
                    title="Insert Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </MenuButton>

                <div className="flex-1" />

                <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo className="h-4 w-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo className="h-4 w-4" />
                </MenuButton>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
