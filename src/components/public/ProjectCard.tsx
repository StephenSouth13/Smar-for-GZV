import Link from "next/link";
import Image from "next/image";
import type { ProjectDoc } from "@/lib/data/projects";

export function ProjectCard({ project }: { project: ProjectDoc }) {
  return (
    <Link
      href={`/du-an/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line/70 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted text-sm">Chưa có ảnh</div>
        )}
      </div>
      <div className="p-5">
        {project.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-ink group-hover:text-brand-dark transition-colors">{project.title}</h3>
        {project.client && <p className="mt-1 text-sm text-ink-muted">{project.client}</p>}
      </div>
    </Link>
  );
}
