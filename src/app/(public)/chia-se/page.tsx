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
      title: "Chia sẻ",
      seoDescription: "Kiến thức, góc nhìn và cập nhật mới nhất về marketing, thương hiệu, content, media và tăng trưởng từ GZV.",
      seoKeywords: "marketing, kiến thức marketing, chia sẻ GZV, thương hiệu, content marketing, media, performance",
      path: "/chia-se",
    },
    settings,
  );
}

export default async function PostsPage() {
  const posts = await listPosts({ publishedOnly: true });

  return (
    <div className="bg-surface/60">
      <section className="border-b border-line/70 bg-white py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-dark">Chia sẻ</span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Kiến thức & cập nhật</h1>
            <p className="mt-4 text-base leading-7 text-ink-muted">Góc nhìn và kinh nghiệm marketing từ đội ngũ GZV.</p>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <PostFilterGrid posts={posts} />
        </Container>
      </section>
    </div>
  );
}
