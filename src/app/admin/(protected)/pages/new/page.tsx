import { PageBuilder } from "@/components/admin/PageBuilder";
import type { PageDoc } from "@/lib/data/pages";

const BLANK_PAGE: PageDoc = {
  slug: "",
  title: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  ogImageUrl: "",
  published: false,
  sections: [],
  updatedAt: "",
};

export default function NewPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tạo trang mới</h1>
        <p className="text-ink-muted mt-1">Đặt tên, đường dẫn và thêm các section cho trang.</p>
      </div>
      <PageBuilder page={BLANK_PAGE} isNew />
    </div>
  );
}
