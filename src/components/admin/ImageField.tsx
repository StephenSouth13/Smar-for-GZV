"use client";

import type { ChangeEvent } from "react";
import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Crop, FolderOpen, ImagePlus, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadMediaAction, listMediaAction } from "@/lib/actions/media";
import { cld } from "@/lib/image-url";
import { resizeImageIfNeeded } from "@/lib/crop-image";
import type { MediaItem } from "@/lib/data/media";
import { ImageCropDialog } from "./ImageCropDialog";

export function ImageField({
  label,
  value,
  onChange,
  aspect,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ src: string; name: string; type: string } | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    // No fixed aspect declared (e.g. client logos, pre-designed banners) —
    // forcing a crop here would cut off part of images that don't happen to
    // match an arbitrary ratio. Skip cropping, but still downscale oversized
    // source files (design-tool exports are often 10-20MB) so they don't
    // get rejected by the upload size cap.
    if (aspect === undefined) {
      startUpload(async () => {
        const blob = await resizeImageIfNeeded(file);
        await doUpload(blob, file.name);
      });
      return;
    }
    setPendingFile({ src: URL.createObjectURL(file), name: file.name, type: file.type || "image/jpeg" });
  }

  async function doUpload(blob: Blob, filename: string) {
    const formData = new FormData();
    formData.append("file", blob, filename);
    const result = await uploadMediaAction(formData);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.item) {
      onChange(result.item.url);
      toast.success("Đã tải ảnh lên.");
    }
  }

  function uploadBlob(blob: Blob, filename: string) {
    startUpload(() => doUpload(blob, filename));
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-ink">{label}</label>}
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface">
          {value ? (
            <Image
              src={cld(value, { width: 160, height: 160, crop: aspect === undefined ? "fit" : "fill" })}
              alt=""
              width={80}
              height={80}
              className={aspect === undefined ? "h-full w-full object-contain p-1" : "h-full w-full object-cover"}
              unoptimized
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-ink-muted" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input placeholder="https://..." value={value} onChange={(e) => onChange(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
              {uploading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-1 h-4 w-4" />}
              Tải ảnh lên
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setLibraryOpen(true)}>
              <FolderOpen className="mr-1 h-4 w-4" />
              Thư viện
            </Button>
            {value && aspect !== undefined && (
              <Button type="button" variant="outline" size="sm" onClick={() => setPendingFile({ src: value, name: "recrop.jpg", type: "image/jpeg" })}>
                <Crop className="mr-1 h-4 w-4" />
                Cắt lại
              </Button>
            )}
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="mr-1 h-4 w-4" />
                Xóa
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

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    if (!items) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => `${item.path} ${item.url}`.toLowerCase().includes(needle));
  }, [items, query]);

  async function load() {
    setError(null);
    setItems(null);
    const result = await listMediaAction();
    setItems(result.items);
    if (result.error) {
      setError(result.error);
      toast.error(result.error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (nextOpen) load();
      }}
    >
      <DialogContent className="max-h-[84vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn ảnh từ thư viện</DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="space-y-3 py-10 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button type="button" variant="outline" size="sm" onClick={load}>
              Thử lại
            </Button>
          </div>
        ) : items === null ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tải thư viện ảnh...
          </div>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-muted">Chưa có ảnh nào. Hãy tải ảnh lên trước.</p>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên ảnh..." className="pl-9" />
            </div>
            {visible.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-muted">Không tìm thấy ảnh phù hợp.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {visible.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => onSelect(item.url)}
                    className="group overflow-hidden rounded-lg border border-line bg-white text-left shadow-sm transition-all hover:border-brand hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-surface">
                      <Image src={cld(item.url, { width: 360, height: 360 })} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <div className="truncate px-2 py-2 text-xs font-medium text-ink-muted group-hover:text-ink">
                      {item.path.split("/").pop()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
