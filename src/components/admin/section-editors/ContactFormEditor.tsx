"use client";

import { Input } from "@/components/ui/input";
import { Field } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function ContactFormEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["contactForm"];
  onChange: (data: SectionDataMap["contactForm"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Mô tả phụ">
        <Input value={data.subheading} onChange={(e) => onChange({ ...data, subheading: e.target.value })} />
      </Field>
      <Field label="Email nhận yêu cầu (tuỳ chọn, ngoài lưu trong hệ thống)">
        <Input
          type="email"
          placeholder="sales@gzv.one"
          value={data.submitEmail}
          onChange={(e) => onChange({ ...data, submitEmail: e.target.value })}
        />
      </Field>
      <p className="text-xs text-ink-muted">
        Mọi yêu cầu tư vấn gửi qua form này đều được lưu lại — xem tại Firestore collection{" "}
        <code className="rounded bg-surface px-1">leads</code>.
      </p>
    </div>
  );
}
