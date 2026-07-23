import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import { PostCard } from "@/components/public/PostCard";
import { listPosts, listPostsByIds } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import type { SectionDataMap } from "@/lib/schema/sections";

export async function ArticleGrid({ data }: { data: SectionDataMap["articleGrid"] }) {
  const [posts, settings] = await Promise.all([
    data.mode === "manual" ? listPostsByIds(data.postIds) : listPosts({ publishedOnly: true, limit: data.limit }),
    getSiteSettings(),
  ]);

  const visible = data.mode === "manual" ? posts.filter((p) => p.published) : posts;
  if (visible.length === 0) return null;

  return (
    <section className="py-20 bg-surface">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink">{data.heading || "Bài viết mới nhất"}</h2>
          <Link href="/chia-se" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} categories={settings.postCategories} />
          ))}
        </div>
      </Container>
    </section>
  );
}
