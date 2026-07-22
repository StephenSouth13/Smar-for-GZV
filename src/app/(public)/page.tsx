import type { Metadata } from "next";
import { getPublishedPageBySlug } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";
import { SectionList } from "@/components/sections/SectionRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPublishedPageBySlug("home"), getSiteSettings()]);
  return buildMetadata(page ?? {}, settings);
}

export default async function HomePage() {
  const page = await getPublishedPageBySlug("home");

  if (!page) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Website đang được xây dựng</h1>
          <p className="mt-2 text-ink-muted">Nội dung trang chủ sẽ sớm được cập nhật.</p>
        </div>
      </div>
    );
  }

  return <SectionList sections={page.sections} />;
}
