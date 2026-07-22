"use client";

import { useMemo, useState } from "react";
import { FolderKanban, Search, SlidersHorizontal, Tag } from "lucide-react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/lib/data/projects";
import type { SettingsInput } from "@/lib/schema/content";

export function ProjectFilterGrid({
  projects,
  categories,
  initialCategory = "",
}: {
  projects: ProjectDoc[];
  categories: SettingsInput["projectCategories"];
  initialCategory?: string;
}) {
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))).filter(Boolean), [projects]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeTag, setActiveTag] = useState("");
  const [query, setQuery] = useState("");

  const visible = projects.filter((project) => {
    const matchCategory = activeCategory ? project.category === activeCategory : true;
    const matchTag = activeTag ? project.tags.includes(activeTag) : true;
    const haystack = `${project.title} ${project.client} ${project.summary} ${project.tags.join(" ")}`.toLowerCase();
    const matchQuery = query.trim() ? haystack.includes(query.trim().toLowerCase()) : true;
    return matchCategory && matchTag && matchQuery;
  });

  function setCategory(category: string) {
    setActiveCategory(category);
    setActiveTag("");
    const url = new URL(window.location.href);
    if (category) url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line/70 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm dự án, khách hàng, dịch vụ..."
              className="h-11 w-full rounded-lg border border-line/70 bg-surface pl-10 pr-3 text-sm outline-none transition-colors focus:border-brand/60 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <SlidersHorizontal className="h-4 w-4" />
            {visible.length}/{projects.length} dự án
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
              activeCategory === "" ? "border-brand bg-brand text-white" : "border-line/70 bg-white text-ink hover:border-brand/50",
            )}
          >
            <FolderKanban className="h-4 w-4" />
            Tất cả
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setCategory(category.slug)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                activeCategory === category.slug
                  ? "border-brand bg-brand text-white"
                  : "border-line/70 bg-white text-ink hover:border-brand/50",
              )}
            >
              <FolderKanban className="h-4 w-4" />
              {category.label}
            </button>
          ))}
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-line/60 pt-4">
            <button
              onClick={() => setActiveTag("")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTag === "" ? "bg-ink text-white" : "bg-surface text-ink-muted hover:text-ink",
              )}
            >
              <Tag className="h-3.5 w-3.5" />
              Tất cả dịch vụ
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeTag === tag ? "bg-ink text-white" : "bg-surface text-ink-muted hover:text-ink",
                )}
              >
                <Tag className="h-3.5 w-3.5" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center text-ink-muted">
          Chưa có dự án phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} categories={categories} />
          ))}
        </div>
      )}
    </div>
  );
}
