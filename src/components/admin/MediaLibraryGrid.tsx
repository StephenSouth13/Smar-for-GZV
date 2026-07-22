"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, Copy, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uploadMediaAction, deleteMediaAction } from "@/lib/actions/media";
import type { MediaItem } from "@/lib/data/media";

export function MediaLibraryGrid({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    startUpload(async () => {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadMediaAction(formData);
        if (result.error) {
          toast.error(`${file.name}: ${result.error}`);
        } else if (result.item) {
          setItems((prev) => [result.item!, ...prev]);
        }
      }
      toast.success("Đã tải ảnh lên.");
    });
  }

  async function handleDelete(path: string) {
    setDeletingPath(path);
    try {
      await deleteMediaAction(path);
      setItems((prev) => prev.filter((i) => i.path !== path));
      toast.success("Đã xoá ảnh.");
    } catch {
      toast.error("Xoá thất bại.");
    } finally {
      setDeletingPath(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép URL.");
  }

  return (
    <div className="space-y-6">
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-white py-10 text-center cursor-pointer hover:border-brand/60 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? <Loader2 className="h-8 w-8 text-brand animate-spin" /> : <UploadCloud className="h-8 w-8 text-brand" />}
        <p className="font-medium text-ink">Kéo thả ảnh vào đây hoặc bấm để chọn</p>
        <p className="text-xs text-ink-muted">Hỗ trợ JPG, PNG, WEBP — tối đa 8MB mỗi ảnh</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-ink-muted py-12">Chưa có ảnh nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.path} className="overflow-hidden group">
              <div className="relative aspect-square bg-surface">
                <Image src={item.url} alt="" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button type="button" size="icon" variant="secondary" onClick={() => copyUrl(item.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    disabled={deletingPath === item.path}
                    onClick={() => handleDelete(item.path)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="truncate text-xs text-ink-muted">{item.path.split("/").pop()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
