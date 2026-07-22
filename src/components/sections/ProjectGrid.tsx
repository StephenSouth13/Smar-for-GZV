import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { listProjects, listProjectsByIds } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import type { SectionDataMap } from "@/lib/schema/sections";

export async function ProjectGrid({ data }: { data: SectionDataMap["projectGrid"] }) {
  const projects =
    data.mode === "manual"
      ? await listProjectsByIds(data.projectIds)
      : await listProjects({ publishedOnly: true, limit: data.limit, category: data.category });

  const visible = data.mode === "manual" ? projects.filter((p) => p.published) : projects;
  if (visible.length === 0) return null;
  const settings = await getSiteSettings();

  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">{data.heading || "Dự án nổi bật"}</h2>
          <Link
            href={data.category ? `/du-an?category=${data.category}` : "/du-an"}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} categories={settings.projectCategories} />
          ))}
        </div>
      </Container>
    </section>
  );
}
