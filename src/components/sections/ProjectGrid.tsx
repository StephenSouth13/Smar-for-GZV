import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import { ProjectCard } from "@/components/public/ProjectCard";
import { listProjects, listProjectsByIds } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import type { SectionDataMap } from "@/lib/schema/sections";

type ProjectGridData = SectionDataMap["projectGrid"];

export async function ProjectGrid({ data }: { data: ProjectGridData }) {
  let visible;
  if (data.mode === "manual") {
    visible = (await listProjectsByIds(data.projectIds)).filter((p) => p.published);
  } else {
    // Fetch unlimited so featured ("ghim") projects can be pinned to the
    // front even if they'd otherwise fall past the display limit, then slice.
    const projects = await listProjects({ publishedOnly: true, category: data.category });
    visible = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, data.limit);
  }
  if (visible.length === 0) return null;

  const settings = await getSiteSettings();

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-accent)]">Projects</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {data.heading || "Dự án nổi bật"}
            </h2>
          </div>
          <Link
            href={data.category ? `/du-an?category=${data.category}` : "/du-an"}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-accent)] hover:text-brand-dark"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} categories={settings.projectCategories} />
          ))}
        </div>
      </Container>
    </section>
  );
}
