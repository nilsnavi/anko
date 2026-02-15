import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    SeparatorHorizontal,
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const MenuButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}> = ({ onClick, isActive, disabled, title, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-colors ${isActive
            ? 'bg-brand-100 text-brand-700'
            : 'text-slate-600 hover:bg-slate-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    content,
    onChange,
    placeholder = 'Введите текст...',
    minHeight = '200px',
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                linkOnPaste: true,
            }),
            Image.configure({
                allowBase64: true,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-slate max-w-none focus:outline-none min-h-[${minHeight}]`,
                placeholder,
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt('Введите URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Введите URL изображения:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 border-b border-slate-200 bg-slate-50">
                {/* History */}
                <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
                    <MenuButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Отменить"
                    >
                        <Undo size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Повторить"
                    >
                        <Redo size={18} />
                    </MenuButton>
                </div>

                {/* Text Style */}
                <div className="flex items-center gap-1 px-3 border-r border-slate-200">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Жирный"
                    >
                        <Bold size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Курсив"
                    >
                        <Italic size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Зачеркнутый"
                    >
                        <Strikethrough size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Код"
                    >
                        <Code size={18} />
                    </MenuButton>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-1 px-3 border-r border-slate-200">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Заголовок 1"
                    >
                        <Heading1 size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Заголовок 2"
                    >
                        <Heading2 size={18} />
                    </MenuButton>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 px-3 border-r border-slate-200">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Маркированный список"
                    >
                        <List size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Нумерованный список"
                    >
                        <ListOrdered size={18} />
                    </MenuButton>
                </div>

                {/* Block */}
                <div className="flex items-center gap-1 px-3 border-r border-slate-200">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Цитата"
                    >
                        <Quote size={18} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Разделитель"
                    >
                        <SeparatorHorizontal size={18} />
                    </MenuButton>
                </div>

                {/* Media */}
                <div className="flex items-center gap-1 pl-3">
                    <MenuButton onClick={addLink} title="Добавить ссылку">
                        <LinkIcon size={18} />
                    </MenuButton>
                    <MenuButton onClick={addImage} title="Добавить изображение">
                        <ImageIcon size={18} />
                    </MenuButton>
                </div>
            </div>

            {/* Editor */}
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>

            {/* Word Count */}
            <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-xs text-slate-400 flex justify-between">
                <span>
                    {editor.storage.characterCount?.characters?.() || 0} символов
                </span>
                <span>
                    {editor.storage.characterCount?.words?.() || 0} слов
                </span>
            </div>
        </div>
    );
};

export default RichTextEditor;
