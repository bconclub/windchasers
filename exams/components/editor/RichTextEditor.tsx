"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarAction {
  label: string;
  icon: React.ReactNode;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const actions: ToolbarAction[] = [
  {
    label: "Bold",
    icon: <Bold className="h-4 w-4" />,
    isActive: (editor) => editor.isActive("bold"),
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Italic",
    icon: <Italic className="h-4 w-4" />,
    isActive: (editor) => editor.isActive("italic"),
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Bullet list",
    icon: <List className="h-4 w-4" />,
    isActive: (editor) => editor.isActive("bulletList"),
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Numbered list",
    icon: <ListOrdered className="h-4 w-4" />,
    isActive: (editor) => editor.isActive("orderedList"),
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Subscript",
    icon: <SubscriptIcon className="h-4 w-4" />,
    isActive: (editor) => editor.isActive("subscript"),
    run: (editor) => editor.chain().focus().toggleSubscript().run(),
  },
  {
    label: "Superscript",
    icon: <SuperscriptIcon className="h-4 w-4" />,
    isActive: (editor) => editor.isActive("superscript"),
    run: (editor) => editor.chain().focus().toggleSuperscript().run(),
  },
];

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  label,
  error,
  minHeight = "8rem",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  minHeight?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        horizontalRule: false,
      }),
      Subscript,
      Superscript,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "stem-content px-3 py-2 text-sm text-dark focus:outline-none",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Keep the editor in sync when the parent resets the form
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next && !editor.isFocused) {
      editor.commands.setContent(next, false);
    }
  }, [editor, value]);

  return (
    <div className="space-y-1">
      {label ? <span className="block text-sm font-medium text-dark">{label}</span> : null}
      <div
        className={cn(
          "tiptap-editor rounded-md border bg-white",
          error ? "border-danger" : "border-dark-100"
        )}
      >
        <div className="flex flex-wrap items-center gap-1 border-b border-dark-100 px-2 py-1">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              title={action.label}
              aria-label={action.label}
              onClick={() => editor && action.run(editor)}
              className={cn(
                "rounded p-1.5 text-dark-500 hover:bg-dark-50 hover:text-dark",
                editor && action.isActive(editor) && "bg-gold-50 text-gold-700"
              )}
            >
              {action.icon}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-dark-100" />
          <button
            type="button"
            title="Undo"
            aria-label="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            className="rounded p-1.5 text-dark-500 hover:bg-dark-50 hover:text-dark"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Redo"
            aria-label="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            className="rounded p-1.5 text-dark-500 hover:bg-dark-50 hover:text-dark"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
