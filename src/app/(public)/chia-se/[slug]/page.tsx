import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/public/Container";
import { getPublishedPostBySlug } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";
import { cld } from "@/lib/image-url";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPublishedPostBySlug(slug), getSiteSettings()]);
  if (!post) return buildMetadata({}, settings);
  return buildMetadata(
    {
      ...post,
      seoDescription: post.seoDescription || post.excerpt,
      ogImageUrl: post.ogImageUrl || post.coverImageUrl,
      path: `/chia-se/${slug}`,
    },
    settings,
  );
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPublishedPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();

  const categoryLabel = post.category ? settings.postCategories.find((category) => category.slug === post.category)?.label || post.category : "";

  return (
    <article className="bg-black py-16 text-white">
      <Container className="max-w-3xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-white/55">
            {categoryLabel && <span className="font-medium text-brand-accent">{categoryLabel}</span>}
            {categoryLabel && <span>•</span>}
            <span>{formatDate(post.publishedAt)}</span>
            {post.author && <span>•</span>}
            {post.author && <span>{post.author}</span>}
          </div>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{post.title}</h1>
        </div>

        {post.coverImageUrl && (
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-md border border-white/10 bg-[#111111]">
            <Image src={cld(post.coverImageUrl, { width: 1600, height: 900 })} alt={post.title} fill className="object-cover" unoptimized priority />
          </div>
        )}

        {post.content && (
          <div
            className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-brand-accent prose-p:text-white/72 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </Container>
    </article>
  );
}
