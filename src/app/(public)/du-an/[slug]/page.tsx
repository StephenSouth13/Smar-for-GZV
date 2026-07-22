import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Images, Tag } from "lucide-react";
import { Container } from "@/components/public/Container";
import { getPublishedProjectBySlug } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";
import { cld } from "@/lib/image-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getPublishedProjectBySlug(slug), getSiteSettings()]);
  if (!project) return buildMetadata({}, settings);
  return buildMetadata(
    {
      ...project,
      seoDescription: project.seoDescription || project.summary,
      ogImageUrl: project.ogImageUrl || project.coverImageUrl,
    },
    settings,
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getPublishedProjectBySlug(slug), getSiteSettings()]);
  if (!project) notFound();

  const categoryLabel = project.category
    ? settings.projectCategories.find((category) => category.slug === project.category)?.label
    : "";

  return (
    <article className="bg-white">
      <section className="border-b border-line/70 bg-surface/70 py-8 sm:py-12">
        <Container>
          <Link href="/du-an" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-brand-dark">
            <ArrowLeft className="h-4 w-4" />
            Quay lại dự án
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                {categoryLabel && (
                  <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {categoryLabel}
                  </span>
                )}
                {project.featured && (
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Nổi bật
                  </span>
                )}
              </div>
              <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              {project.summary && <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-muted">{project.summary}</p>}
            </div>

            <div className="rounded-xl border border-line/70 bg-white p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <InfoItem icon={BriefcaseBusiness} label="Khách hàng" value={project.client || "Đang cập nhật"} />
                <InfoItem icon={Tag} label="Danh mục" value={categoryLabel || "Chưa phân loại"} />
                <InfoItem icon={Images} label="Thư viện" value={`${project.gallery.length + (project.coverImageUrl ? 1 : 0)} hình ảnh`} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {project.coverImageUrl && (
        <section className="bg-white py-8">
          <Container>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line/70 bg-surface shadow-sm">
              <Image
                src={cld(project.coverImageUrl, { width: 1600, height: 900 })}
                alt={project.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </Container>
        </section>
      )}

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {project.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface px-3 py-1.5 text-sm font-semibold text-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {project.content ? (
              <div className="prose prose-neutral max-w-none prose-headings:text-ink prose-p:text-ink-muted" dangerouslySetInnerHTML={{ __html: project.content }} />
            ) : (
              <div className="rounded-xl border border-dashed border-line bg-surface p-8 text-ink-muted">
                Nội dung chi tiết đang được cập nhật.
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-line/70 bg-surface p-5">
              <h2 className="text-base font-bold text-ink">Điểm nổi bật</h2>
              <div className="mt-4 space-y-3">
                {[categoryLabel || "Chiến lược triển khai", project.client || "Đồng hành cùng khách hàng", "Tối ưu nhận diện và hiệu quả"].map(
                  (item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark" />
                      <span>{item}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
            <Link
              href="/lien-he"
              className="flex items-center justify-between rounded-xl bg-brand px-5 py-4 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark"
            >
              Tư vấn dự án tương tự
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>

        {project.gallery.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Gallery</span>
                <h2 className="mt-2 text-2xl font-extrabold text-ink">Hình ảnh dự án</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((url, i) => (
                <div key={url + i} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line/70 bg-surface">
                  <Image src={cld(url, { width: 900, height: 675 })} alt={`${project.title} ${i + 1}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand-dark">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</div>
        <div className="mt-1 font-bold text-ink">{value}</div>
      </div>
    </div>
  );
}
