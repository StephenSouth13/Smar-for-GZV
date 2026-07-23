import { z } from "zod";

export const sectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number(),
  title: z.string().default(""),
  hidden: z.boolean().default(false),
  backgroundColor: z.string().default(""),
  textColor: z.string().default(""),
  accentColor: z.string().default(""),
  data: z.record(z.string(), z.unknown()),
});

export const pageSchema = z.object({
  slug: z
    .string()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Chỉ dùng chữ thường, số và dấu gạch ngang"),
  title: z.string().min(1, "Bắt buộc"),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  ogImageUrl: z.string().default(""),
  published: z.boolean().default(false),
  sections: z.array(sectionSchema).default([]),
});
export type PageInput = z.infer<typeof pageSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  slug: z
    .string()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Chỉ dùng chữ thường, số và dấu gạch ngang"),
  coverImageUrl: z.string().default(""),
  gallery: z.array(z.string()).default([]),
  client: z.string().default(""),
  category: z.string().default(""),
  tags: z.array(z.string()).default([]),
  summary: z.string().default(""),
  content: z.string().default(""),
  order: z.number().default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  ogImageUrl: z.string().default(""),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const postSchema = z.object({
  title: z.string().min(1, "Bắt buộc"),
  slug: z
    .string()
    .min(1, "Bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Chỉ dùng chữ thường, số và dấu gạch ngang"),
  coverImageUrl: z.string().default(""),
  category: z.string().default(""),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  author: z.string().default("GZV"),
  published: z.boolean().default(false),
  publishedAt: z.string().default(""),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  ogImageUrl: z.string().default(""),
});
export type PostInput = z.infer<typeof postSchema>;

export const menuItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const categorySchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
});

export const settingsSchema = z.object({
  siteName: z.string().default("GZV"),
  tagline: z.string().default("Solution For Marketing"),
  themeColor: z.string().default("#005ba8"),
  themeAccentColor: z.string().default("#ed1c24"),
  themeSurfaceColor: z.string().default("#f3f7fb"),
  themeInkColor: z.string().default("#13263a"),
  themeMutedColor: z.string().default("#64748b"),
  themeLineColor: z.string().default("#d8e3ee"),
  themeRadius: z.number().min(4).max(24).default(10),
  logoUrl: z.string().default(""),
  faviconUrl: z.string().default(""),
  ogImageUrl: z.string().default(""),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.string().default(""),
  showHeader: z.boolean().default(true),
  contactEmail: z.string().default(""),
  contactPhone: z.string().default(""),
  address: z.string().default(""),
  socialFacebook: z.string().default(""),
  socialYoutube: z.string().default(""),
  socialZalo: z.string().default(""),
  headerMenu: z.array(menuItemSchema).default([]),
  projectCategories: z
    .array(categorySchema)
    .default([
      { label: "Dự án Nhân hiệu", slug: "du-an-nhan-hieu" },
      { label: "Dự án Phẩm hiệu", slug: "du-an-pham-hieu" },
    ]),
  footerText: z.string().default(""),
  footerLogoUrl: z.string().default(""),
  footerHeadline: z.string().default(""),
  footerDescription: z.string().default(""),
  footerCtaText: z.string().default(""),
  footerCtaHref: z.string().default("/lien-he"),
  footerCopyright: z.string().default(""),
  footerQuickLinks: z.array(menuItemSchema).default([]),
  footerServiceLinks: z.array(menuItemSchema).default([]),
  showAdminLink: z.boolean().default(true),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
