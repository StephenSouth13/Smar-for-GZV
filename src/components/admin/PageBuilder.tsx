"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SectionEditor } from "@/components/admin/section-editors";
import { SECTION_TYPES, SECTION_TYPE_META, createSection, type Section, type SectionType } from "@/lib/schema/sections";
import type { PageDoc } from "@/lib/data/pages";
import { savePageAction } from "@/lib/actions/pages";

type PageFormState = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  published: boolean;
  sections: Section[];
};

type SectionMetaPatch = Pick<Partial<Section>, "title" | "hidden" | "backgroundColor" | "textColor" | "accentColor">;

function ColorMetaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-line bg-transparent p-1"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Mặc định" className="font-mono" />
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Xóa
          </Button>
        )}
      </div>
    </div>
  );
}

function SortableSectionCard({
  section,
  index,
  expanded,
  onToggleExpand,
  onRemove,
  onChangeMeta,
  onChangeData,
}: {
  section: Section;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onChangeMeta: (patch: SectionMetaPatch) => void;
  onChangeData: (data: Section["data"]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={isDragging ? "opacity-60" : ""}>
      <Card className="border-line/70 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 px-4 py-3">
            <button type="button" className="cursor-grab text-ink-muted hover:text-ink touch-none" {...attributes} {...listeners}>
              <GripVertical className="h-4 w-4" />
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand-dark">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-ink">{section.title || SECTION_TYPE_META[section.type].label}</div>
                {section.hidden && <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-medium text-ink-muted">Đang ẩn</span>}
              </div>
              <div className="truncate text-xs text-ink-muted">{SECTION_TYPE_META[section.type].description}</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-ink-muted"
              onClick={() => onChangeMeta({ hidden: !section.hidden })}
              aria-label={section.hidden ? "Hiện section" : "Ẩn section"}
            >
              {section.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onToggleExpand}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {expanded && (
            <div className="border-t border-line/70 bg-surface/60 p-4">
              <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-line/70 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-1.5">
                  <Label>Tên section trong admin</Label>
                  <Input
                    value={section.title ?? ""}
                    onChange={(e) => onChangeMeta({ title: e.target.value })}
                    placeholder={SECTION_TYPE_META[section.type].label}
                  />
                </div>
                <div className="flex items-center gap-3 pb-1">
                  <Switch checked={!section.hidden} onCheckedChange={(checked) => onChangeMeta({ hidden: !checked })} />
                  <span className="text-sm font-medium text-ink">{section.hidden ? "Đang ẩn" : "Đang hiện"}</span>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-line/70 bg-white p-3 lg:grid-cols-3">
                <ColorMetaField
                  label="Màu nền section"
                  value={section.backgroundColor}
                  onChange={(backgroundColor) => onChangeMeta({ backgroundColor })}
                />
                <ColorMetaField label="Màu chữ" value={section.textColor} onChange={(textColor) => onChangeMeta({ textColor })} />
                <ColorMetaField label="Màu nhấn" value={section.accentColor} onChange={(accentColor) => onChangeMeta({ accentColor })} />
              </div>

              <SectionEditor section={section} onChange={onChangeData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function PageBuilder({ page, isNew }: { page: PageDoc; isNew: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState<PageFormState>({
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    seoKeywords: page.seoKeywords,
    ogImageUrl: page.ogImageUrl,
    published: page.published,
    sections: page.sections,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function addSection(type: SectionType) {
    const section = createSection(type, form.sections.length, nanoid(8));
    setForm((f) => ({ ...f, sections: [...f.sections, section] }));
    setExpandedId(section.id);
  }

  function removeSection(id: string) {
    setForm((f) => ({ ...f, sections: f.sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })) }));
  }

  function updateSectionData(id: string, data: Section["data"]) {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) => (s.id === id ? ({ ...s, data } as Section) : s)),
    }));
  }

  function updateSectionMeta(id: string, patch: SectionMetaPatch) {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) => (s.id === id ? ({ ...s, ...patch } as Section) : s)),
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setForm((f) => {
      const oldIndex = f.sections.findIndex((s) => s.id === active.id);
      const newIndex = f.sections.findIndex((s) => s.id === over.id);
      return { ...f, sections: arrayMove(f.sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i })) };
    });
  }

  function handleSave() {
    startSaving(async () => {
      try {
        const result = await savePageAction(isNew ? null : page.slug, form);
        toast.success("Đã lưu trang.");
        if (isNew || result.slug !== page.slug) router.push(`/admin/pages/${result.slug}`);
        else router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-line/70 bg-white shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tiêu đề trang</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Đường dẫn (slug)</Label>
              <Input
                value={form.slug}
                disabled={form.slug === "home"}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="vi-du: gioi-thieu"
              />
              <p className="text-xs text-ink-muted">{form.slug === "home" ? "Trang chủ (/)" : `Sẽ hiển thị tại /${form.slug}`}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>SEO title</Label>
            <Input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>SEO description</Label>
            <Textarea rows={2} value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-1.5">
              <Label>SEO keywords</Label>
              <Input
                value={form.seoKeywords}
                onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                placeholder="marketing, thiết kế website, GZV"
              />
            </div>
            <ImageField label="Ảnh OG / social share" value={form.ogImageUrl} onChange={(ogImageUrl) => setForm((f) => ({ ...f, ogImageUrl }))} />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Switch checked={form.published} onCheckedChange={(published) => setForm((f) => ({ ...f, published }))} />
            <div className="flex items-center gap-1.5 text-sm">
              {form.published ? <Eye className="h-4 w-4 text-brand" /> : <EyeOff className="h-4 w-4 text-ink-muted" />}
              {form.published ? "Đã xuất bản" : "Bản nháp"}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-ink">Các section ({form.sections.length})</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button type="button" variant="outline" />}>
              <Plus className="h-4 w-4 mr-1" />
              Thêm section
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {SECTION_TYPES.map((type) => (
                <DropdownMenuItem key={type} onSelect={() => addSection(type)}>
                  <div>
                    <div className="font-medium">{SECTION_TYPE_META[type].label}</div>
                    <div className="text-xs text-ink-muted">{SECTION_TYPE_META[type].description}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" onClick={handleSave} disabled={saving} className="bg-brand hover:bg-brand-dark">
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Đang lưu..." : "Lưu trang"}
          </Button>
        </div>
      </div>

      {form.sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-ink-muted">Chưa có section nào. Bấm “Thêm section” để bắt đầu.</CardContent>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={form.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {form.sections.map((section, index) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  expanded={expandedId === section.id}
                  onToggleExpand={() => setExpandedId(expandedId === section.id ? null : section.id)}
                  onRemove={() => removeSection(section.id)}
                  onChangeMeta={(patch) => updateSectionMeta(section.id, patch)}
                  onChangeData={(data) => updateSectionData(section.id, data)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
