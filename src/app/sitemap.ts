import type { MetadataRoute } from "next";
import { listPages } from "@/lib/data/pages";
import { listPosts } from "@/lib/data/posts";
import { listProjects } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { normalizeSiteUrl } from "@/lib/seo";

function withSite(siteUrl: string, path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, pages, projects, posts] = await Promise.all([
    getSiteSettings(),
    listPages(),
    listProjects({ publishedOnly: true }),
    listPosts({ publishedOnly: true }),
  ]);
  const siteUrl = normalizeSiteUrl(settings.siteUrl);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: withSite(siteUrl, "/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: withSite(siteUrl, "/du-an"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: withSite(siteUrl, "/chia-se"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: withSite(siteUrl, "/lien-he"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const pageRoutes = pages
    .filter((page) => page.published && !["home"].includes(page.slug))
    .map((page) => ({
      url: withSite(siteUrl, `/${page.slug}`),
      lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const projectRoutes = projects.map((project) => ({
    url: withSite(siteUrl, `/du-an/${project.slug}`),
    lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const postRoutes = posts.map((post) => ({
    url: withSite(siteUrl, `/chia-se/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...pageRoutes, ...projectRoutes, ...postRoutes];
}
