import { z } from "zod";

export const SOCIAL_PLATFORMS = ["facebook", "zalo", "youtube", "tiktok", "instagram", "linkedin", "website"] as const;
export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS).default("website"),
  url: z.string().default(""),
});
export type SocialLink = z.infer<typeof socialLinkSchema>;

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
  siteUrl: z.string().default("https://marketing.gzv.one"),
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
  seoTitle: z.string().default("GZV Marketing - Giải pháp Nhân hiệu và Phẩm hiệu"),
  seoDescription: z
    .string()
    .default(
      "GZV cung cấp giải pháp marketing toàn diện: chiến lược thương hiệu, nhân hiệu, phẩm hiệu, website, content, media và performance giúp doanh nghiệp tăng trưởng bền vững.",
    ),
  seoKeywords: z
    .string()
    .default("GZV, marketing, giải pháp marketing, nhân hiệu, phẩm hiệu, thiết kế website, content marketing, media, performance marketing"),
  showHeader: z.boolean().default(true),
  contactEmail: z.string().default(""),
  contactPhone: z.string().default(""),
  address: z.string().default(""),
  contactPageHeading: z.string().default("Liên hệ với GZV"),
  contactPageSubheading: z.string().default(""),
  contactFormHeading: z.string().default("Yêu cầu tư vấn"),
  contactFormSubheading: z.string().default("Để lại thông tin, đội ngũ GZV sẽ liên hệ tư vấn trong thời gian sớm nhất."),
  contactMapEmbedUrl: z.string().default(""),
  contactMapLink: z.string().default(""),
  socialLinks: z.array(socialLinkSchema).default([]),
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
  loadingScreenEnabled: z.boolean().default(false),
  loadingScreenLogoUrl: z.string().default(""),
  loadingScreenText: z.string().default(""),
  loadingScreenEffect: z.enum(["spinner", "pulse", "bar"]).default("spinner"),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
