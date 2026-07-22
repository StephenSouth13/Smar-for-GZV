"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/components/admin/ImageField";
import { Field } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function HeroEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["hero"];
  onChange: (data: SectionDataMap["hero"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề chính">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Mô tả phụ">
        <Textarea
          rows={2}
          value={data.subheading}
          onChange={(e) => onChange({ ...data, subheading: e.target.value })}
        />
      </Field>
      <Field label="Ảnh nền">
        <ImageField
          aspect={16 / 9}
          value={data.backgroundImageUrl}
          onChange={(url) => onChange({ ...data, backgroundImageUrl: url })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Chữ nút CTA">
          <Input value={data.ctaText} onChange={(e) => onChange({ ...data, ctaText: e.target.value })} />
        </Field>
        <Field label="Liên kết nút CTA">
          <Input value={data.ctaLink} onChange={(e) => onChange({ ...data, ctaLink: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}
