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
    <section className="bg-[#111111] py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">News</span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{data.heading || "Tin tức mới nhất"}</h2>
          </div>
          <Link href="/chia-se" className="hidden items-center gap-1.5 text-sm font-semibold text-brand-accent hover:text-white sm:inline-flex">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} categories={settings.postCategories} />
          ))}
        </div>
      </Container>
    </section>
  );
}
