"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { FolderKanban, GripVertical, ImageOff, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { updateProjectAction, reorderProjectsAction } from "@/lib/actions/projects";
import { cld } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/lib/data/projects";
import type { ProjectInput, SettingsInput } from "@/lib/schema/content";

function PublishToggle({ project }: { project: ProjectDoc }) {
  const [pending, startToggle] = useTransition();

  function toggle(published: boolean) {
    startToggle(async () => {
      try {
        await updateProjectAction(project.id, { ...project, published } as ProjectInput);
        toast.success(published ? "Đã xuất bản dự án." : "Đã chuyển về bản nháp.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Cập nhật thất bại.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={project.published} disabled={pending} onCheckedChange={toggle} />
      <Badge variant={project.published ? "default" : "secondary"} className={project.published ? "bg-brand" : ""}>
        {project.published ? "Đã xuất bản" : "Nháp"}
      </Badge>
    </div>
  );
}

function SortableRow({
  project,
  reorderable,
  categoryLabel,
}: {
  project: ProjectDoc;
  reorderable: boolean;
  categoryLabel: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 bg-surface opacity-80 shadow-md" : ""}
    >
      <TableCell>
        {reorderable ? (
          <button type="button" className="cursor-grab touch-none text-ink-muted hover:text-ink" {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          <span className="block h-4 w-4" />
        )}
      </TableCell>
      <TableCell>
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg border border-line/70 bg-surface">
          {project.coverImageUrl ? (
            <Image
              src={cld(project.coverImageUrl, { width: 88, height: 88 })}
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <ImageOff className="h-4 w-4 text-ink-muted" />
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium text-ink whitespace-normal">
        <div className="flex items-center gap-2">
          {project.title}
          {project.featured && (
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3" />
              Nổi bật
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-ink-muted">{project.client || "—"}</TableCell>
      <TableCell className="text-ink-muted">{categoryLabel || "—"}</TableCell>
      <TableCell>
        <PublishToggle project={project} />
      </TableCell>
      <TableCell>
        <ProjectRowActions id={project.id} title={project.title} slug={project.slug} published={project.published} />
      </TableCell>
    </TableRow>
  );
}

export function ProjectsTable({
  projects,
  categories,
}: {
  projects: ProjectDoc[];
  categories: SettingsInput["projectCategories"];
}) {
  const [prevProjects, setPrevProjects] = useState(projects);
  const [items, setItems] = useState(projects);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const categoryLabelBySlug = useMemo(() => new Map(categories.map((category) => [category.slug, category.label])), [categories]);

  // Re-sync the locally-reorderable copy when the server gives us a fresh
  // `projects` array (e.g. after router.refresh()), without the extra
  // render+flicker an effect-based sync would cause.
  if (projects !== prevProjects) {
    setPrevProjects(projects);
    setItems(projects);
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((project) => {
      const matchCategory = activeCategory ? project.category === activeCategory : true;
      const haystack = `${project.title} ${project.client} ${project.tags.join(" ")}`.toLowerCase();
      const matchQuery = needle ? haystack.includes(needle) : true;
      return matchCategory && matchQuery;
    });
  }, [items, query, activeCategory]);

  const reorderable = query.trim() === "" && activeCategory === "";

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    reorderProjectsAction(next.map((p) => p.id)).catch(() => {
      toast.error("Không lưu được thứ tự mới.");
      setItems(items);
    });
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center text-ink-muted">
        Chưa có dự án nào.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line/70 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên dự án, khách hàng, tag..."
              className="h-10 w-full rounded-lg border border-line/70 bg-surface pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand/60 focus:bg-white"
            />
          </div>
          <div className="text-sm font-medium text-ink-muted">
            {visible.length}/{items.length} dự án
          </div>
        </div>
        {categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === "" ? "bg-brand text-white" : "bg-surface text-ink-muted hover:text-ink",
              )}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeCategory === category.slug ? "bg-brand text-white" : "bg-surface text-ink-muted hover:text-ink",
                )}
              >
                <FolderKanban className="h-3.5 w-3.5" />
                {category.label}
              </button>
            ))}
          </div>
        )}
        {!reorderable && (
          <p className="mt-3 text-xs text-ink-muted">Xóa tìm kiếm/bộ lọc danh mục để kéo-thả sắp xếp thứ tự hiển thị.</p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-line/70 bg-white shadow-sm">
        {visible.length === 0 ? (
          <div className="py-16 text-center text-ink-muted">Không tìm thấy dự án phù hợp.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-16"></TableHead>
                <TableHead>Tên dự án</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={visible.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {visible.map((project) => (
                    <SortableRow
                      key={project.id}
                      project={project}
                      reorderable={reorderable}
                      categoryLabel={project.category ? categoryLabelBySlug.get(project.category) ?? project.category : ""}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
