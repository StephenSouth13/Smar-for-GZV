"use client";

import { Input } from "@/components/ui/input";
import { ImageField } from "@/components/admin/ImageField";
import { Field, ListEditor } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function ImageGalleryEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["imageGallery"];
  onChange: (data: SectionDataMap["imageGallery"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề (tuỳ chọn)">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Hình ảnh">
        <ListEditor
          items={data.images}
          onChange={(images) => onChange({ ...data, images })}
          newItem={() => ({ imageUrl: "", caption: "" })}
          addLabel="Thêm ảnh"
          renderItem={(item, update) => (
            <div className="space-y-3">
              <ImageField value={item.imageUrl} onChange={(url) => update({ imageUrl: url })} />
              <Input placeholder="Chú thích (tuỳ chọn)" value={item.caption} onChange={(e) => update({ caption: e.target.value })} />
            </div>
          )}
        />
      </Field>
    </div>
  );
}
