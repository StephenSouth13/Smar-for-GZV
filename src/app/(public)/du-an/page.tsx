import type { Metadata } from "next";
import { Container } from "@/components/public/Container";
import { ProjectFilterGrid } from "@/components/public/ProjectFilterGrid";
import { listProjects } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Các dự án tiêu biểu GZV đã đồng hành cùng khách hàng.",
};

export default async function ProjectsPage() {
  const projects = await listProjects({ publishedOnly: true });

  return (
    <div className="py-16">
      <Container>
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand">Dự án</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink">Dự án tiêu biểu</h1>
          <p className="mt-3 text-ink-muted max-w-xl mx-auto">
            Những dự án GZV đã đồng hành cùng khách hàng qua các dịch vụ Content, Design, Media, Performance và
            Website.
          </p>
        </div>
        <ProjectFilterGrid projects={projects} />
      </Container>
    </div>
  );
}
