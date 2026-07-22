"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { Field, ListEditor } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function TestimonialsEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["testimonials"];
  onChange: (data: SectionDataMap["testimonials"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề (tuỳ chọn)">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Đánh giá">
        <ListEditor
          items={data.items}
          onChange={(items) => onChange({ ...data, items })}
          newItem={() => ({ quote: "", author: "", role: "", avatarUrl: "" })}
          addLabel="Thêm đánh giá"
          renderItem={(item, update) => (
            <div className="space-y-3">
              <Textarea placeholder="Trích dẫn" rows={2} value={item.quote} onChange={(e) => update({ quote: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Tên khách hàng" value={item.author} onChange={(e) => update({ author: e.target.value })} />
                <Input placeholder="Chức vụ / công ty" value={item.role} onChange={(e) => update({ role: e.target.value })} />
              </div>
              <ImageField label="Ảnh đại diện" value={item.avatarUrl} onChange={(url) => update({ avatarUrl: url })} />
            </div>
          )}
        />
      </Field>
    </div>
  );
}
