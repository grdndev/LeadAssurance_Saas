"use client";

import './style.css';
import { Bold, Code, CornerDownLeft, Heading1, Heading2, Heading3, Italic, Link, List, ListOrdered, Minus, Quote, Redo, Strikethrough, Type, Underline as UnderlineIcon, Undo } from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useState } from 'react';
import DragHandle from '@tiptap/extension-drag-handle-react';
import StarterKit from '@tiptap/starter-kit';

type TextEditorProps = {
  content?: string
  onChange?: (html: string, clean: string) => void
};

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const [tick, setTick] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1,2,3] },
        link: { openOnClick: false }
      }),
    ],
    content: content ?? "",
    immediatelyRender: false,
    onUpdate: ({editor}) => {
      onChange?.(editor.getHTML(), editor.getText())
    }
  });

  useEffect(() => {
    if (!editor) return;
    const handle = () => setTick(t => t + 1);
    editor.on("update", handle);
    editor.on("selectionUpdate", handle);

    return () => {
      editor.destroy();
    }
  }, [editor]);

  if (!editor) return;

  return (
    <>
      <div className="content-options flex gap-2">
        <div className="content-options-group">
          <button
            onClick={() =>
              editor.chain().focus().setParagraph().run()
            }
            className={`border rounded ${editor.isActive('paragraph') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Type />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().setHeading({ level: 1 }).run()
            }
            className={`border rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Heading1 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
            className={`border rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Heading2 />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
            className={`border rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Heading3 />
          </button>
        </div>
        <div className="content-options-group">
          <button
            onClick={() =>
              editor.chain().focus().toggleBold().run()
            }
            className={`border rounded ${editor.isActive('bold') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Bold />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleItalic().run()
            }
            className={`border rounded ${editor.isActive('italic') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Italic />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            className={`border rounded ${editor.isActive('underline') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <UnderlineIcon />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleStrike().run()
            }
            className={`border rounded ${editor.isActive('strike') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Strikethrough />
          </button>
          <button
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }
            }}
            className={`border rounded ${editor.isActive('link') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Link />
          </button>
        </div>
        <div className="content-options-group">
          <button
            onClick={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
            className={`border rounded ${editor.isActive('blockquote') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Quote />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
            className={`border rounded ${editor.isActive('codeBlock') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <Code />
          </button>
        </div>
        <div className="content-options-group">
          <button
            onClick={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            className={`border rounded ${editor.isActive('bulletList') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <List />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            className={`border rounded ${editor.isActive('orderedList') ? 'bg-blue-500' : 'bg-gray-200 text-gray-500'}`}
          >
            <ListOrdered />
          </button>
        </div>
        <div className="content-options-group">
          <button
            onClick={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
            className="border rounded bg-gray-200 text-gray-500"
          >
            <Minus />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().setHardBreak().run()
            }
            className="border rounded bg-gray-200 text-gray-500"
          >
            <CornerDownLeft />
          </button>
        </div>
        <div className="content-options-group">
          <button
            onClick={() =>
              editor.chain().focus().undo().run()
            }
            className="border rounded bg-gray-200 text-gray-500"
          >
            <Undo />
          </button>
          <button
            onClick={() =>
              editor.chain().focus().redo().run()
            }
            className="border rounded bg-gray-200 text-gray-500"
          >
            <Redo />
          </button>
        </div>
      </div>
      <DragHandle editor={editor} nested={false}>
        <div className="custom-drag-handle pr-1 pt-1" />
      </DragHandle>
      <EditorContent editor={editor} className="text-editor" />
    </>
  )
}