import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
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
  const detailHref = `/du-an/${project.slug}`;
  const hasLiveUrl = Boolean(project.liveUrl);

  const cover = (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#161616]">
      {project.coverImageUrl ? (
        <Image
          src={cld(project.coverImageUrl, { width: 900, height: 675 })}
          alt={project.title}
          fill
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
          unoptimized
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-white/45">Chưa có ảnh</div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-black/70 text-white ring-1 ring-white/15 transition-transform group-hover:rotate-12">
        {hasLiveUrl ? <ExternalLink className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
      </div>
    </div>
  );

  return (
    <div className="group overflow-hidden rounded-md border border-white/10 bg-[#111111] shadow-sm transition-all hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl hover:shadow-brand/10">
      {hasLiveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Xem website ${project.title}`}>
          {cover}
        </a>
      ) : (
        <Link href={detailHref} aria-label={`Xem chi tiết ${project.title}`}>
          {cover}
        </Link>
      )}
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {categoryLabel && <span className="rounded bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand-accent">{categoryLabel}</span>}
          {project.tags.slice(0, categoryLabel ? 2 : 3).map((tag) => (
            <span key={tag} className="rounded bg-white/8 px-2.5 py-1 text-xs font-medium text-white/58">
              {tag}
            </span>
          ))}
        </div>
        <Link href={detailHref} className="block">
          <h3 className="text-base font-bold text-white transition-colors hover:text-brand-accent">{project.title}</h3>
        </Link>
        {project.client && <p className="mt-1 text-sm font-medium text-white/56">{project.client}</p>}
        {project.summary && <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/60">{project.summary}</p>}
        <Link href={detailHref} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-accent transition-colors hover:text-white">
          Xem chi tiết dự án
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
