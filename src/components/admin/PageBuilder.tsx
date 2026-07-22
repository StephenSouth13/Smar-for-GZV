"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ChevronDown, ChevronUp, Plus, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionEditor } from "@/components/admin/section-editors";
import { SECTION_TYPES, SECTION_TYPE_META, createSection, type Section, type SectionType } from "@/lib/schema/sections";
import type { PageDoc } from "@/lib/data/pages";
import { savePageAction } from "@/lib/actions/pages";

type PageFormState = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sections: Section[];
};

function SortableSectionCard({
  section,
  index,
  expanded,
  onToggleExpand,
  onRemove,
  onChangeData,
}: {
  section: Section;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onChangeData: (data: Section["data"]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-60" : ""}
    >
      <Card className="border-line/70">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 px-4 py-3">
            <button
              type="button"
              className="cursor-grab text-ink-muted hover:text-ink touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand-dark">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink">{SECTION_TYPE_META[section.type].label}</div>
              <div className="text-xs text-ink-muted truncate">{SECTION_TYPE_META[section.type].description}</div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onToggleExpand}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {expanded && (
            <div className="border-t border-line/70 p-4 bg-surface/60">
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
    published: page.published,
    sections: page.sections,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function addSection(type: SectionType) {
    const nextOrder = form.sections.length;
    const section = createSection(type, nextOrder, nanoid(8));
    setForm((f) => ({ ...f, sections: [...f.sections, section] }));
    setExpandedId(section.id);
  }

  function removeSection(id: string) {
    setForm((f) => ({ ...f, sections: f.sections.filter((s) => s.id !== id) }));
  }

  function updateSectionData(id: string, data: Section["data"]) {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s) => (s.id === id ? ({ ...s, data } as Section) : s)),
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setForm((f) => {
      const oldIndex = f.sections.findIndex((s) => s.id === active.id);
      const newIndex = f.sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(f.sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
      return { ...f, sections: reordered };
    });
  }

  function handleSave() {
    startSaving(async () => {
      try {
        const result = await savePageAction(isNew ? null : page.slug, form);
        toast.success("Đã lưu trang.");
        if (isNew || result.slug !== page.slug) {
          router.push(`/admin/pages/${result.slug}`);
        } else {
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Lưu thất bại.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <p className="text-xs text-ink-muted">
                {form.slug === "home" ? "Trang chủ (/)" : `Sẽ hiển thị tại /${form.slug}`}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>SEO title (tuỳ chọn)</Label>
            <Input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>SEO description (tuỳ chọn)</Label>
            <Textarea
              rows={2}
              value={form.seoDescription}
              onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Switch
              checked={form.published}
              onCheckedChange={(published) => setForm((f) => ({ ...f, published }))}
            />
            <div className="flex items-center gap-1.5 text-sm">
              {form.published ? <Eye className="h-4 w-4 text-brand" /> : <EyeOff className="h-4 w-4 text-ink-muted" />}
              {form.published ? "Đã xuất bản" : "Bản nháp (chưa hiển thị công khai)"}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Các section ({form.sections.length})</h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button type="button" variant="outline" />}>
              <Plus className="h-4 w-4 mr-1" />
              Thêm section
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
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
          <CardContent className="py-12 text-center text-ink-muted">
            Chưa có section nào. Bấm &quot;Thêm section&quot; để bắt đầu xây dựng trang.
          </CardContent>
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
