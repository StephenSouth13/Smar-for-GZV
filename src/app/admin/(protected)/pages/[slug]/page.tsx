import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data/pages";
import { PageBuilder } from "@/components/admin/PageBuilder";
import { DeletePageButton } from "@/components/admin/DeletePageButton";

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Chỉnh sửa trang</h1>
          <p className="text-ink-muted mt-1">{page.title || page.slug}</p>
        </div>
        {page.slug !== "home" && <DeletePageButton slug={page.slug} />}
      </div>
      <PageBuilder page={page} isNew={false} />
    </div>
  );
}
