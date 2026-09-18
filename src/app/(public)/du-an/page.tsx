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
      seoDescription: "Những chiến dịch và dự án tiêu biểu do GZV cùng đối tác triển khai.",
      seoKeywords: "dự án GZV, marketing, sales, digital transformation, events, education",
      path: "/du-an",
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
    <div className="bg-black">
      <section className="border-b border-white/10 bg-black py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">Dự án đã triển khai</span>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Dự án tiêu biểu</h1>
            <p className="mt-4 text-base leading-7 text-white/66">
              Những chiến dịch và dự án tiêu biểu do GZV cùng đối tác triển khai.
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
