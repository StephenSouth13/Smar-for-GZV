"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "./fields";
import { listPostsForPickerAction } from "@/lib/actions/posts";
import type { SectionDataMap } from "@/lib/schema/sections";

export function ArticleGridEditor({
  data,
  onChange,
}: {
  data: SectionDataMap["articleGrid"];
  onChange: (data: SectionDataMap["articleGrid"]) => void;
}) {
  const [options, setOptions] = useState<{ id: string; title: string; published: boolean }[] | null>(null);

  useEffect(() => {
    if (data.mode === "manual" && options === null) {
      listPostsForPickerAction().then(setOptions);
    }
  }, [data.mode, options]);

  function toggleId(id: string, checked: boolean) {
    const postIds = checked ? [...data.postIds, id] : data.postIds.filter((x) => x !== id);
    onChange({ ...data, postIds });
  }

  return (
    <div className="space-y-4">
      <Field label="Tiêu đề">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>
      <Field label="Chế độ hiển thị">
        <Select value={data.mode} onValueChange={(mode) => mode && onChange({ ...data, mode })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Tự động (mới nhất)</SelectItem>
            <SelectItem value="manual">Chọn tay</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      {data.mode === "auto" ? (
        <Field label="Số lượng hiển thị">
          <Input
            type="number"
            min={1}
            max={24}
            value={data.limit}
            onChange={(e) => onChange({ ...data, limit: Number(e.target.value) || 1 })}
          />
        </Field>
      ) : (
        <Field label="Chọn bài viết">
          {options === null ? (
            <p className="text-sm text-ink-muted">Đang tải danh sách bài viết...</p>
          ) : options.length === 0 ? (
            <p className="text-sm text-ink-muted">Chưa có bài viết nào. Hãy tạo bài viết trước.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-line p-3">
              {options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={data.postIds.includes(opt.id)}
                    onCheckedChange={(c) => toggleId(opt.id, c === true)}
                  />
                  {opt.title}
                  {!opt.published && <span className="text-xs text-ink-muted">(chưa xuất bản)</span>}
                </label>
              ))}
            </div>
          )}
        </Field>
      )}
    </div>
  );
}
