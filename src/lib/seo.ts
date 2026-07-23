import type { Metadata } from "next";
import type { SettingsInput } from "@/lib/schema/content";

type SeoSource = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImageUrl?: string;
  path?: string;
};

function splitKeywords(value?: string) {
  return (value ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function normalizeSiteUrl(siteUrl?: string) {
  const value = (siteUrl || "https://marketing.gzv.one").trim().replace(/\/+$/, "");
  if (!value) return "https://marketing.gzv.one";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function absoluteUrl(siteUrl: string, pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${path}`;
}

export function buildMetadata(source: SeoSource, settings: SettingsInput): Metadata {
  const siteUrl = normalizeSiteUrl(settings.siteUrl);
  const title = source.seoTitle || source.title || settings.seoTitle || settings.siteName;
  const description = source.seoDescription || settings.seoDescription || settings.tagline || undefined;
  const keywords = splitKeywords(source.seoKeywords || settings.seoKeywords);
  const image = absoluteUrl(siteUrl, source.ogImageUrl || settings.ogImageUrl || settings.logoUrl);
  const canonical = absoluteUrl(siteUrl, source.path || "/");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: canonical ? { canonical } : undefined,
    icons: { icon: settings.faviconUrl || "/gzv-logo.png", shortcut: settings.faviconUrl || "/gzv-logo.png" },
    openGraph: {
      title,
      description,
      url: canonical,
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
