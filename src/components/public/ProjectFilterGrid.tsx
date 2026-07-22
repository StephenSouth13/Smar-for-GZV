"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/public/ProjectCard";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/lib/data/projects";

export function ProjectFilterGrid({ projects }: { projects: ProjectDoc[] }) {
  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))), [projects]);
  const [active, setActive] = useState<string | null>(null);

  const visible = active ? projects.filter((p) => p.tags.includes(active)) : projects;

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActive(null)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active === null ? "bg-brand text-white" : "bg-surface text-ink-muted hover:bg-line/40",
            )}
          >
            Tất cả
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === tag ? "bg-brand text-white" : "bg-surface text-ink-muted hover:bg-line/40",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      {visible.length === 0 ? (
        <p className="text-center text-ink-muted py-16">Chưa có dự án nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
