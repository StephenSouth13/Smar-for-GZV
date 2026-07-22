import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPageBySlug } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/settings";
import { buildMetadata } from "@/lib/seo";
import { SectionList } from "@/components/sections/SectionRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPublishedPageBySlug(slug), getSiteSettings()]);
  if (!page) return buildMetadata({}, settings);
  return buildMetadata(page, settings);
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) notFound();
  return <SectionList sections={page.sections} />;
}
