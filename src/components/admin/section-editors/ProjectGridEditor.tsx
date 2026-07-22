"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "./fields";
import { listProjectsForPickerAction } from "@/lib/actions/projects";
import { listProjectCategoriesAction } from "@/lib/actions/settings";
import type { SettingsInput } from "@/lib/schema/content";
import type { SectionDataMap } from "@/lib/schema/sections";

type ProjectGridData =
  | SectionDataMap["projectGrid"]
  | SectionDataMap["projectBrandGrid"]
  | SectionDataMap["projectProductGrid"];

export function ProjectGridEditor({
  data,
  onChange,
}: {
  data: ProjectGridData;
  onChange: (data: ProjectGridData) => void;
}) {
  const [options, setOptions] = useState<{ id: string; title: string; published: boolean }[] | null>(null);
  const [categories, setCategories] = useState<SettingsInput["projectCategories"] | null>(null);

  useEffect(() => {
    if (data.mode === "manual" && options === null) {
      listProjectsForPickerAction().then(setOptions);
    }
  }, [data.mode, options]);

  useEffect(() => {
    if (categories === null) {
      listProjectCategoriesAction().then(setCategories);
    }
  }, [categories]);

  function toggleId(id: string, checked: boolean) {
    const projectIds = checked ? [...data.projectIds, id] : data.projectIds.filter((x) => x !== id);
    onChange({ ...data, projectIds });
  }

  return (
    <div className="space-y-4">
      <Field label="Tiêu đề">
        <Input value={data.heading} onChange={(e) => onChange({ ...data, heading: e.target.value })} />
      </Field>

      <Field label="Danh mục dự án">
        <Select
          value={data.category || "all"}
          onValueChange={(category) => {
            if (!category) return;
            onChange({ ...data, category: category === "all" ? "" : category });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {(categories ?? []).map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Chế độ hiển thị">
        <Select
          value={data.mode}
          onValueChange={(mode) => {
            if (!mode) return;
            onChange({ ...data, mode: mode as ProjectGridData["mode"] });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Tự động</SelectItem>
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
        <Field label="Chọn dự án">
          {options === null ? (
            <p className="text-sm text-ink-muted">Đang tải danh sách dự án...</p>
          ) : options.length === 0 ? (
            <p className="text-sm text-ink-muted">Chưa có dự án nào. Hãy tạo dự án trước.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-line p-3">
              {options.map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={data.projectIds.includes(opt.id)} onCheckedChange={(c) => toggleId(opt.id, c === true)} />
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
