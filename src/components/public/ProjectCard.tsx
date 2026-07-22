import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cld } from "@/lib/image-url";
import type { ProjectDoc } from "@/lib/data/projects";
import type { SettingsInput } from "@/lib/schema/content";

export function ProjectCard({
  project,
  categories = [],
}: {
  project: ProjectDoc;
  categories?: SettingsInput["projectCategories"];
}) {
  const categoryLabel = project.category ? categories.find((category) => category.slug === project.category)?.label : "";

  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-line/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {project.coverImageUrl ? (
          <Image
            src={cld(project.coverImageUrl, { width: 900, height: 675 })}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-muted">Chưa có ảnh</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-transform group-hover:rotate-12">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {categoryLabel && <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand-dark">{categoryLabel}</span>}
          {project.tags.slice(0, categoryLabel ? 2 : 3).map((tag) => (
            <span key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-muted">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-base font-bold text-ink transition-colors group-hover:text-brand-dark">{project.title}</h3>
        {project.client && <p className="mt-1 text-sm font-medium text-ink-muted">{project.client}</p>}
        {project.summary && <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-muted">{project.summary}</p>}
      </div>
    </Link>
  );
}
