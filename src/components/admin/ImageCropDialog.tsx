"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ZoomIn } from "lucide-react";
import { getCroppedImageBlob } from "@/lib/crop-image";

export function ImageCropDialog({
  imageSrc,
  aspect,
  onCancel,
  onDone,
}: {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onDone: (blob: Blob) => void;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setWorking(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onDone(blob);
    } finally {
      setWorking(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cắt & chỉnh vị trí ảnh</DialogTitle>
        </DialogHeader>

        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-ink">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect ?? 4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="space-y-1.5 pt-1">
          <Label className="flex items-center gap-1.5 text-xs text-ink-muted">
            <ZoomIn className="h-3.5 w-3.5" />
            Thu phóng
          </Label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <p className="text-xs text-ink-muted">Kéo ảnh để chọn vị trí hiển thị, dùng thanh trượt để phóng to/thu nhỏ.</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={working}>
            Huỷ
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={working} className="bg-brand hover:bg-brand-dark">
            {working ? "Đang xử lý..." : "Dùng ảnh này"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
