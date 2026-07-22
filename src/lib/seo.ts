import type { Metadata } from "next";
import type { SettingsInput } from "@/lib/schema/content";

type SeoSource = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImageUrl?: string;
};

function splitKeywords(value?: string) {
  return (value ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function buildMetadata(source: SeoSource, settings: SettingsInput): Metadata {
  const title = source.seoTitle || source.title || settings.seoTitle || settings.siteName;
  const description = source.seoDescription || settings.seoDescription || settings.tagline || undefined;
  const keywords = splitKeywords(source.seoKeywords || settings.seoKeywords);
  const image = source.ogImageUrl || settings.ogImageUrl || settings.logoUrl || undefined;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl, shortcut: settings.faviconUrl } : undefined,
    openGraph: {
      title,
      description,
      siteName: settings.siteName,
      locale: "vi_VN",
      type: "website",
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
