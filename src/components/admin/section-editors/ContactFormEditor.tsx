"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, ListEditor } from "./fields";
import { slugify } from "@/lib/utils/slug";
import type { SectionDataMap } from "@/lib/schema/sections";

type CustomFieldType = SectionDataMap["contactForm"]["customFields"][number]["type"];
type CustomField = SectionDataMap["contactForm"]["customFields"][number];

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: "Văn bản ngắn",
  email: "Email",
  tel: "Số điện thoại",
  textarea: "Văn bản dài",
  select: "Danh sách chọn",
};

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

      <Field label="Trường tự do (thêm câu hỏi riêng ngoài Họ tên/SĐT/Email/Công ty)">
        <ListEditor<CustomField>
          items={data.customFields}
          onChange={(customFields) => onChange({ ...data, customFields })}
          newItem={() => ({ key: `field_${Date.now()}`, label: "Câu hỏi mới", type: "text", required: false, options: "" })}
          addLabel="Thêm trường"
          emptyLabel="Chưa có trường tự do nào — form chỉ dùng các trường mặc định."
          renderItem={(item, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Nhãn hiển thị"
                  value={item.label}
                  onChange={(e) => update({ label: e.target.value, key: item.key || slugify(e.target.value) })}
                />
                <Select value={item.type} onValueChange={(type) => type && update({ type: type as CustomFieldType })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {item.type === "select" && (
                <Input
                  placeholder="Các lựa chọn, cách nhau bằng dấu phẩy"
                  value={item.options}
                  onChange={(e) => update({ options: e.target.value })}
                />
              )}
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={item.required} onCheckedChange={(c) => update({ required: c === true })} />
                Bắt buộc nhập
              </label>
            </div>
          )}
        />
      </Field>

      <p className="text-xs text-ink-muted">
        Mọi yêu cầu tư vấn gửi qua form này đều được lưu lại — xem tại{" "}
        <code className="rounded bg-surface px-1">/admin/leads</code>.
      </p>
    </div>
  );
}
