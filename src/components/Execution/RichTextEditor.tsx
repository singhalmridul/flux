"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Bold, Italic, Strikethrough, Code, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    editable?: boolean;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1 p-1 border-b border-border/40 bg-muted/20 rounded-t-md">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn(
                    "p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                    editor.isActive("bold") ? "bg-muted text-foreground" : ""
                )}
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn(
                    "p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                    editor.isActive("italic") ? "bg-muted text-foreground" : ""
                )}
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn(
                    "p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                    editor.isActive("strike") ? "bg-muted text-foreground" : ""
                )}
            >
                <Strikethrough className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={cn(
                    "p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                    editor.isActive("code") ? "bg-muted text-foreground" : ""
                )}
            >
                <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border/40 mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                    "p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                    editor.isActive("bulletList") ? "bg-muted text-foreground" : ""
                )}
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                    "p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
                    editor.isActive("orderedList") ? "bg-muted text-foreground" : ""
                )}
            >
                <ListOrdered className="w-4 h-4" />
            </button>
        </div>
    );
};

export function RichTextEditor({ content = "", onChange, editable = true, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write something...",
            }),
        ],
        content: content,
        editable: editable,
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4",
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    return (
        <div className={cn("border border-border/40 rounded-md bg-background/50 backdrop-blur-sm shadow-sm flex flex-col", className)}>
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        </div>
    );
}
