"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  RxFontBold,
  RxFontItalic,
  RxListBullet,
} from "react-icons/rx";
import { TbH1, TbH2, TbH3 } from "react-icons/tb";
import Tooltip from "@mui/material/Tooltip";

// TipTap menu button component
const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  tooltip = "",
}) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? "bg-gray-300 dark:bg-gray-600"
          : "hover:bg-gray-300 dark:hover:bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  // If disabled, wrap in span so Tooltip still works
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

const TipTapEditor = ({
  id,
  value,
  content,
  onChange,
  placeholder = "Enter your text here...",
  register = () => {},
  required,
  validate,
  defaultValue,
}) => {
  const initialContent = content || value || defaultValue || "";
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false
  });

  React.useEffect(() => {
    if (editor) {
      const newContent = content || value || defaultValue || "";
      if (editor.getHTML() !== newContent) {
        editor.commands.setContent(newContent);
      }
    }
  }, [content, value, defaultValue, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-[90rem]">
      <div className="tiptap-editor-container border-[1px] border-black dark:border-gray-600 rounded-lg overflow-y-auto">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-black/10 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <MenuButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor?.isActive("heading", { level: 1 })}
            disabled={
              !editor?.can().chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <TbH1 size={18} />
          </MenuButton>

          <MenuButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor?.isActive("heading", { level: 2 })}
            disabled={
              !editor?.can().chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <TbH2 size={18} />
          </MenuButton>

          <MenuButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor?.isActive("heading", { level: 3 })}
            disabled={
              !editor?.can().chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <TbH3 size={18} />
          </MenuButton>

          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <MenuButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            tooltip="Bold"
          >
            <RxFontBold size={18} />
          </MenuButton>

          <MenuButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            tooltip="Italic"
          >
            <RxFontItalic size={18} />
          </MenuButton>

          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <MenuButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive("bulletList")}
            disabled={!editor?.can().chain().focus().toggleBulletList().run()}
            tooltip="Bullet List"
          >
            <RxListBullet size={18} />
          </MenuButton>
        </div>

        {/* TipTap Editor Content */}
        <EditorContent
          id={id}
          {...register(id, { required, validate })}
          editor={editor}
          className="prose prose-sm dark:prose-invert min-h-[200px] max-h-[350px] bg-white overflow-hidden dark:bg-gray-900 focus:outline-none"
        />
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror {
          height: 100%;
          min-height: 200px;
          max-height: 350px;
          overflow-y: auto;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default TipTapEditor;
