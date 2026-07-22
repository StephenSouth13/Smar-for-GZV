"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function CtaEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["cta"];
  onChange: (data: SectionDataMap["cta"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Nội dung">
        <Textarea rows={2} value={data.body} onChange={(e) => onChange({ ...data, body: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Chữ nút bấm">
          <Input value={data.buttonText} onChange={(e) => onChange({ ...data, buttonText: e.target.value })} />
        </Field>
        <Field label="Liên kết nút bấm">
          <Input value={data.buttonLink} onChange={(e) => onChange({ ...data, buttonLink: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}
