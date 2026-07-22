"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { Field, ListEditor } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function AboutPreviewEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["aboutPreview"];
  onChange: (data: SectionDataMap["aboutPreview"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Nội dung">
        <Textarea rows={4} value={data.body} onChange={(e) => onChange({ ...data, body: e.target.value })} />
      </Field>
      <Field label="Hình ảnh">
        <ImageField aspect={4 / 3} value={data.imageUrl} onChange={(url) => onChange({ ...data, imageUrl: url })} />
      </Field>
      <Field label="Liên kết">
        <ListEditor
          items={data.links}
          onChange={(links) => onChange({ ...data, links })}
          newItem={() => ({ label: "Xem thêm", href: "/gioi-thieu" })}
          addLabel="Thêm liên kết"
          renderItem={(item, update) => (
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Nhãn" value={item.label} onChange={(e) => update({ label: e.target.value })} />
              <Input placeholder="Đường dẫn" value={item.href} onChange={(e) => update({ href: e.target.value })} />
            </div>
          )}
        />
      </Field>
    </div>
  );
}
