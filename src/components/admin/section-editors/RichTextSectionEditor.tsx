"use client";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Field } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function RichTextSectionEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["richText"];
  onChange: (data: SectionDataMap["richText"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Nội dung">
        <RichTextEditor initialContent={data.html} onChange={(html) => onChange({ ...data, html })} />
      </Field>
    </div>
  );
}
