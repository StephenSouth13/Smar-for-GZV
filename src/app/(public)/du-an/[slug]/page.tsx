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
      path: `/du-an/${slug}`,
    },
    settings,
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getPublishedProjectBySlug(slug), getSiteSettings()]);
  if (!project) notFound();

  const categoryLabel = project.category ? settings.projectCategories.find((category) => category.slug === project.category)?.label : "";

  return (
    <article className="bg-black text-white">
      <section className="border-b border-white/10 bg-black py-8 sm:py-12">
        <Container>
          <Link href="/du-an" className="inline-flex items-center gap-2 text-sm font-semibold text-white/58 hover:text-brand-accent">
            <ArrowLeft className="h-4 w-4" />
            Quay lại dự án
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                {categoryLabel && <span className="rounded bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">{categoryLabel}</span>}
                {project.featured && <span className="rounded bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">Nổi bật</span>}
              </div>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{project.title}</h1>
              {project.summary && <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">{project.summary}</p>}
            </div>

            <div className="rounded-md border border-white/10 bg-[#111111] p-5">
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
        <section className="bg-black py-8">
          <Container>
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-white/10 bg-[#111111]">
              <Image src={cld(project.coverImageUrl, { width: 1600, height: 900 })} alt={project.title} fill className="object-cover" unoptimized priority />
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
                  <span key={tag} className="rounded bg-white/8 px-3 py-1.5 text-sm font-semibold text-white/58">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {project.content ? (
              <div
                className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-brand-accent prose-p:text-white/72 prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            ) : (
              <div className="rounded-md border border-dashed border-white/15 bg-[#111111] p-8 text-white/55">Nội dung chi tiết đang được cập nhật.</div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-md border border-white/10 bg-[#111111] p-5">
              <h2 className="text-base font-bold text-white">Điểm nổi bật</h2>
              <div className="mt-4 space-y-3">
                {[categoryLabel || "Chiến lược triển khai", project.client || "Đồng hành cùng khách hàng", "Tối ưu nhận diện và hiệu quả"].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-white/62">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/lien-he" className="flex items-center justify-between rounded-md bg-brand px-5 py-4 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark">
              Tư vấn dự án tương tự
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>

        {project.gallery.length > 0 && (
          <section className="mt-14">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Gallery</span>
              <h2 className="mt-2 text-2xl font-extrabold text-white">Hình ảnh dự án</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((url, i) => (
                <div key={url + i} className="relative aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[#111111]">
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/15 text-brand-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-white/48">{label}</div>
        <div className="mt-1 font-bold text-white">{value}</div>
      </div>
    </div>
  );
}
