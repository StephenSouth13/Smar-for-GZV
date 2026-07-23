"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FolderKanban, ImageOff, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";
import { cld } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/lib/data/projects";
import type { SettingsInput } from "@/lib/schema/content";

export function ProjectsTable({
  projects,
  categories,
}: {
  projects: ProjectDoc[];
  categories: SettingsInput["projectCategories"];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const categoryLabelBySlug = useMemo(() => new Map(categories.map((category) => [category.slug, category.label])), [categories]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchCategory = activeCategory ? project.category === activeCategory : true;
      const haystack = `${project.title} ${project.client} ${project.tags.join(" ")}`.toLowerCase();
      const matchQuery = needle ? haystack.includes(needle) : true;
      return matchCategory && matchQuery;
    });
  }, [projects, query, activeCategory]);

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
            {visible.length}/{projects.length} dự án
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
      </div>

      <div className="overflow-hidden rounded-xl border border-line/70 bg-white shadow-sm">
        {visible.length === 0 ? (
          <div className="py-16 text-center text-ink-muted">Không tìm thấy dự án phù hợp.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16"></TableHead>
                <TableHead>Tên dự án</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((project) => (
                <TableRow key={project.id}>
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
                  <TableCell className="text-ink-muted">
                    {project.category ? categoryLabelBySlug.get(project.category) ?? project.category : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.published ? "default" : "secondary"} className={project.published ? "bg-brand" : ""}>
                      {project.published ? "Đã xuất bản" : "Nháp"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ProjectRowActions id={project.id} title={project.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
