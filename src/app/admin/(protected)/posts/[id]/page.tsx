import { notFound } from "next/navigation";
import { getPostById } from "@/lib/data/posts";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Chỉnh sửa bài viết</h1>
        <p className="text-ink-muted mt-1">{post.title}</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
