"use client";

import { useRef, useState, useTransition } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Minus,
  Undo,
  Redo,
  Heading2,
  Heading3,
  ImagePlus,
  Loader2,
  FolderOpen,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MediaLibraryDialog } from "@/components/admin/ImageField";
import { uploadMediaAction } from "@/lib/actions/media";

function InsertImageControl({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [uploading, startUpload] = useTransition();

  function insertImage(url: string) {
    editor.chain().focus().setImage({ src: url }).run();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    startUpload(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadMediaAction(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.item) insertImage(result.item.url);
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={uploading} />}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Tải ảnh lên
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLibraryOpen(true)}>
            <FolderOpen className="h-4 w-4" />
            Chọn từ thư viện
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <MediaLibraryDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(url) => {
          insertImage(url);
          setLibraryOpen(false);
        }}
      />
    </>
  );
}

export function RichTextEditor({
  initialContent,
  onChange,
}: {
  initialContent: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-lg" } }),
    ],
    content: initialContent || "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[180px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function toggleLink() {
    const url = window.prompt("Nhập URL liên kết:");
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  }

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Đậm" },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Nghiêng" },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      title: "Gạch ngang",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      title: "Tiêu đề lớn",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      title: "Tiêu đề nhỏ",
    },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Danh sách" },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      title: "Danh sách số",
    },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), title: "Trích dẫn" },
    { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, title: "Đường kẻ ngang" },
    { icon: LinkIcon, action: toggleLink, active: editor.isActive("link"), title: "Liên kết" },
  ];

  return (
    <div className="rounded-lg border border-line overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-surface px-2 py-1.5">
        {buttons.map((b, i) => (
          <button
            key={i}
            type="button"
            title={b.title}
            onClick={b.action}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded hover:bg-line/40",
              b.active && "bg-brand/15 text-brand-dark",
            )}
          >
            <b.icon className="h-4 w-4" />
          </button>
        ))}
        <InsertImageControl editor={editor} />
        <span className="flex-1" />
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
