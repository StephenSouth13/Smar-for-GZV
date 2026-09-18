import type { Metadata } from "next";
import { Container } from "@/components/public/Container";
import { PostFilterGrid } from "@/components/public/PostFilterGrid";
import { listPosts } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(
    {
      title: "Tin tức",
      seoDescription: "Cập nhật tin tức, kiến thức và câu chuyện truyền cảm hứng từ GZV.",
      seoKeywords: "tin tức GZV, marketing, sales, digital transformation, education, events",
      path: "/chia-se",
    },
    settings,
  );
}

export default async function PostsPage() {
  const [posts, settings] = await Promise.all([listPosts({ publishedOnly: true }), getSiteSettings()]);

  return (
    <div className="bg-black">
      <section className="border-b border-white/10 bg-black py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">Tin tức mới nhất</span>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Kiến thức & cập nhật</h1>
            <p className="mt-4 text-base leading-7 text-white/66">Cập nhật tin tức, kiến thức và câu chuyện truyền cảm hứng.</p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <PostFilterGrid posts={posts} categories={settings.postCategories} />
        </Container>
      </section>
    </div>
  );
}
