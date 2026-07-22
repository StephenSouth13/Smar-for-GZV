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
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
      new Date(iso),
    );
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
    },
    settings,
  );
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16">
      <Container className="max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
            {post.category && <span className="font-medium text-brand-dark">{post.category}</span>}
            {post.category && <span>•</span>}
            <span>{formatDate(post.publishedAt)}</span>
            {post.author && <span>•</span>}
            {post.author && <span>{post.author}</span>}
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-ink">{post.title}</h1>
        </div>

        {post.coverImageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface mb-10">
            <Image
              src={cld(post.coverImageUrl, { width: 1600, height: 900 })}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}

        {post.content && (
          <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </Container>
    </article>
  );
}
