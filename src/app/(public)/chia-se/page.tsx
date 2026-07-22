import type { Metadata } from "next";
import { Container } from "@/components/public/Container";
import { PostCard } from "@/components/public/PostCard";
import { listPosts } from "@/lib/data/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chia sẻ",
  description: "Kiến thức và cập nhật mới nhất về marketing từ GZV.",
};

export default async function PostsPage() {
  const posts = await listPosts({ publishedOnly: true });

  return (
    <div className="py-16">
      <Container>
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand">Chia sẻ</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-ink">Kiến thức & cập nhật</h1>
          <p className="mt-3 text-ink-muted max-w-xl mx-auto">Góc nhìn và kinh nghiệm marketing từ đội ngũ GZV.</p>
        </div>
        {posts.length === 0 ? (
          <p className="text-center text-ink-muted py-16">Chưa có bài viết nào.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
