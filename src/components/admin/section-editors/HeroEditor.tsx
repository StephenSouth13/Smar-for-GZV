"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/ImageField";
import { Field } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded-md border border-line bg-transparent p-1"
        />
        <Input
          value={value}
          placeholder="Mặc định"
          onChange={(e) => onChange(e.target.value)}
          className="font-mono"
        />
        {value && (
          <button type="button" className="text-xs text-ink-muted hover:text-ink" onClick={() => onChange("")}>
            Xoá
          </button>
        )}
      </div>
    </Field>
  );
}

export function HeroEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["hero"];
  onChange: (data: SectionDataMap["hero"]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-line/70 bg-surface/70 p-4">
        <div>
          <div className="font-medium text-ink">Chỉ hiển thị ảnh banner</div>
          <div className="text-sm text-ink-muted">
            Dùng khi bạn đã có sẵn ảnh banner thiết kế hoàn chỉnh (đã có sẵn chữ, logo...) — ẩn tiêu đề/mô tả/nút bấm bên dưới,
            chỉ hiện đúng ảnh đã tải lên.
          </div>
        </div>
        <Switch checked={data.imageOnly} onCheckedChange={(imageOnly) => onChange({ ...data, imageOnly })} />
      </div>

      <Field label={data.imageOnly ? "Ảnh banner" : "Ảnh nền"}>
        <ImageField
          aspect={data.imageOnly ? undefined : 16 / 9}
          value={data.backgroundImageUrl}
          onChange={(url) => onChange({ ...data, backgroundImageUrl: url })}
        />
      </Field>

      {!data.imageOnly && (
        <>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorField
              label="Màu chữ tiêu đề"
              value={data.headingColor}
              onChange={(headingColor) => onChange({ ...data, headingColor })}
            />
            <ColorField
              label="Màu chữ mô tả phụ"
              value={data.subheadingColor}
              onChange={(subheadingColor) => onChange({ ...data, subheadingColor })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Chữ nút CTA">
              <Input value={data.ctaText} onChange={(e) => onChange({ ...data, ctaText: e.target.value })} />
            </Field>
            <Field label="Liên kết nút CTA">
              <Input value={data.ctaLink} onChange={(e) => onChange({ ...data, ctaLink: e.target.value })} />
            </Field>
          </div>
        </>
      )}

      {data.imageOnly && (
        <Field label="Liên kết khi bấm vào ảnh (tuỳ chọn)">
          <Input
            placeholder="/lien-he"
            value={data.ctaLink}
            onChange={(e) => onChange({ ...data, ctaLink: e.target.value })}
          />
        </Field>
      )}
    </div>
  );
}
