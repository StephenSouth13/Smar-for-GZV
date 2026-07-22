import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Thêm bài viết</h1>
        <p className="text-ink-muted mt-1">Tạo bài viết mới cho mục Chia sẻ.</p>
      </div>
      <PostForm />
    </div>
  );
}
