import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/public/Container";
import { getPublishedProjectBySlug } from "@/lib/data/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary || undefined,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <div className="text-center mb-8">
          {project.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap justify-center gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand-dark">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-ink">{project.title}</h1>
          {project.client && <p className="mt-2 text-ink-muted">Khách hàng: {project.client}</p>}
        </div>

        {project.coverImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface mb-10">
            <Image src={project.coverImageUrl} alt={project.title} fill className="object-cover" unoptimized priority />
          </div>
        )}

        {project.summary && <p className="text-lg text-ink-muted leading-relaxed mb-6">{project.summary}</p>}

        {project.content && (
          <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
        )}

        {project.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {project.gallery.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}
