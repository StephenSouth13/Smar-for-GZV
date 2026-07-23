import { PostForm } from "@/components/admin/PostForm";
import { getSiteSettings } from "@/lib/data/settings";

export default async function NewPostPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Thêm bài viết</h1>
        <p className="text-ink-muted mt-1">Tạo bài viết mới cho mục Chia sẻ.</p>
      </div>
      <PostForm categories={settings.postCategories} />
    </div>
  );
}
