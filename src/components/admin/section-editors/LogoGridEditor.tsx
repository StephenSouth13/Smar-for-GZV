"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/ImageField";
import { Field, ListEditor } from "./fields";
import type { SectionDataMap } from "@/lib/schema/sections";

export function LogoGridEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["logoGrid"];
  onChange: (data: SectionDataMap["logoGrid"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <div className="flex items-center justify-between rounded-lg border border-line/70 bg-surface/70 p-4">
        <div>
          <div className="font-medium text-ink">Chạy dạng carousel tự động</div>
          <div className="text-sm text-ink-muted">
            Bật: logo chạy cuộn ngang liên tục. Tắt: hiển thị dạng lưới tĩnh có tên khách hàng.
          </div>
        </div>
        <Switch checked={data.carousel} onCheckedChange={(carousel) => onChange({ ...data, carousel })} />
      </div>
      <Field label="Danh sách khách hàng">
        <ListEditor
          items={data.logos}
          onChange={(logos) => onChange({ ...data, logos })}
          newItem={() => ({ imageUrl: "", name: "", link: "" })}
          addLabel="Thêm khách hàng"
          emptyLabel="Chưa có logo khách hàng nào."
          renderItem={(item, update) => (
            <div className="space-y-3">
              <ImageField label="Logo khách hàng" value={item.imageUrl} onChange={(url) => update({ imageUrl: url })} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input placeholder="Tên khách hàng" value={item.name} onChange={(e) => update({ name: e.target.value })} />
                <Input placeholder="Liên kết (tùy chọn)" value={item.link} onChange={(e) => update({ link: e.target.value })} />
              </div>
            </div>
          )}
        />
      </Field>
    </div>
  );
}
