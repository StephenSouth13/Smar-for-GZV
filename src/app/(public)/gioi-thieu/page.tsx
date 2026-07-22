import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPageBySlug } from "@/lib/data/pages";
import { SectionList } from "@/components/sections/SectionRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPageBySlug("gioi-thieu");
  if (!page) return {};
  return { title: page.seoTitle || page.title, description: page.seoDescription || undefined };
}

export default async function AboutPage() {
  const page = await getPublishedPageBySlug("gioi-thieu");
  if (!page) notFound();
  return <SectionList sections={page.sections} />;
}
