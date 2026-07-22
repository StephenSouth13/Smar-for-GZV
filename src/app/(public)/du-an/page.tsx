import type { Metadata } from "next";
import { Container } from "@/components/public/Container";
import { ProjectFilterGrid } from "@/components/public/ProjectFilterGrid";
import { listProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(
    {
      title: "Dự án",
      seoDescription: "Các dự án tiêu biểu GZV đã đồng hành cùng khách hàng.",
      seoKeywords: "dự án marketing, nhân hiệu, phẩm hiệu, GZV",
    },
    settings,
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, projects, settings] = await Promise.all([
    searchParams,
    listProjects({ publishedOnly: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="bg-surface/60">
      <section className="border-b border-line/70 bg-white py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark">Dự án</span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Dự án tiêu biểu</h1>
            <p className="mt-4 text-base leading-7 text-ink-muted">
              Khám phá các dự án theo danh mục Nhân hiệu, Phẩm hiệu và nhóm dịch vụ triển khai.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <ProjectFilterGrid projects={projects} categories={settings.projectCategories} initialCategory={category ?? ""} />
        </Container>
      </section>
    </div>
  );
}
