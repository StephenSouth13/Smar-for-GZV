import { listMedia } from "@/lib/data/media";
import { MediaLibraryGrid } from "@/components/admin/MediaLibraryGrid";

export default async function AdminMediaPage() {
  const items = await listMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Thư viện ảnh</h1>
        <p className="text-ink-muted mt-1">Tải ảnh lên để sử dụng trong các section và trang chi tiết.</p>
      </div>
      <MediaLibraryGrid initialItems={items} />
    </div>
  );
}
