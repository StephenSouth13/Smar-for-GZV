"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, FolderOpen, X, Loader2, Crop } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadMediaAction, listMediaAction } from "@/lib/actions/media";
import { cld } from "@/lib/image-url";
import { ImageCropDialog } from "@/components/admin/ImageCropDialog";
import type { MediaItem } from "@/lib/data/media";

export function ImageField({
  label,
  value,
  onChange,
  aspect,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** Fixed crop ratio (width/height), e.g. 16/9 for a hero, 1 for a logo/avatar. Omit to crop freely. */
  aspect?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ src: string; name: string; type: string } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile({ src: URL.createObjectURL(file), name: file.name, type: file.type || "image/jpeg" });
    e.target.value = "";
  }

  function uploadBlob(blob: Blob, filename: string) {
    startUpload(async () => {
      const formData = new FormData();
      formData.append("file", blob, filename);
      const result = await uploadMediaAction(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.item) onChange(result.item.url);
    });
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-ink">{label}</label>}
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface">
          {value ? (
            <Image
              src={cld(value, { width: 160, height: 160 })}
              alt=""
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-ink-muted" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input placeholder="https://..." value={value} onChange={(e) => onChange(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ImagePlus className="h-4 w-4 mr-1" />}
              Tải ảnh lên
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setLibraryOpen(true)}>
              <FolderOpen className="h-4 w-4 mr-1" />
              Thư viện
            </Button>
            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPendingFile({ src: value, name: "recrop.jpg", type: "image/jpeg" })}
              >
                <Crop className="h-4 w-4 mr-1" />
                Cắt lại
              </Button>
            )}
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="h-4 w-4 mr-1" />
                Xoá
              </Button>
            )}
          </div>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <MediaLibraryDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelect={(url) => {
          onChange(url);
          setLibraryOpen(false);
        }}
      />
      {pendingFile && (
        <ImageCropDialog
          imageSrc={pendingFile.src}
          aspect={aspect}
          onCancel={() => setPendingFile(null)}
          onDone={(blob) => {
            uploadBlob(blob, pendingFile.name);
            setPendingFile(null);
          }}
        />
      )}
    </div>
  );
}

function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);

  async function load() {
    const media = await listMediaAction();
    setItems(media);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) load();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn ảnh từ thư viện</DialogTitle>
        </DialogHeader>
        {items === null ? (
          <p className="text-sm text-ink-muted py-8 text-center">Đang tải...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-muted py-8 text-center">Chưa có ảnh nào. Hãy tải ảnh lên trước.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {items.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => onSelect(item.url)}
                className="aspect-square overflow-hidden rounded-lg border border-line hover:border-brand transition-colors"
              >
                <Image
                  src={cld(item.url, { width: 320, height: 320 })}
                  alt=""
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
