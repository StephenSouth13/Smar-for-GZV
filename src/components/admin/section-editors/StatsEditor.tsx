"use client";

import { Input } from "@/components/ui/input";
import { Field, ListEditor } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function StatsEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["stats"];
  onChange: (data: SectionDataMap["stats"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề (tuỳ chọn)">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Số liệu">
        <ListEditor
          items={data.items}
          onChange={(items) => onChange({ ...data, items })}
          newItem={() => ({ label: "Năm kinh nghiệm", value: "5+" })}
          addLabel="Thêm số liệu"
          renderItem={(item, update) => (
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Giá trị (vd: 100+)" value={item.value} onChange={(e) => update({ value: e.target.value })} />
              <Input placeholder="Nhãn" value={item.label} onChange={(e) => update({ label: e.target.value })} />
            </div>
          )}
        />
      </Field>
    </div>
  );
}
