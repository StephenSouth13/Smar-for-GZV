import { z } from "zod";

export const heroDataSchema = z.object({
  heading: z.string().min(1, "Bắt buộc").default("Giải pháp Marketing toàn diện cho doanh nghiệp"),
  subheading: z.string().default(""),
  backgroundImageUrl: z.string().default(""),
  ctaText: z.string().default(""),
  ctaLink: z.string().default(""),
  /** When true, render only the banner image full-bleed — no heading/subheading/CTA overlay. */
  imageOnly: z.boolean().default(false),
  headingColor: z.string().default(""),
  subheadingColor: z.string().default(""),
});

export const aboutPreviewDataSchema = z.object({
  heading: z.string().min(1, "Bắt buộc").default("Về chúng tôi"),
  body: z.string().default(""),
  imageUrl: z.string().default(""),
  links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
});

export const logoGridDataSchema = z.object({
  heading: z.string().default(""),
  logos: z
    .array(
      z.object({
        imageUrl: z.string().min(1),
        name: z.string().default(""),
        link: z.string().default(""),
      }),
    )
    .default([]),
});

export const projectGridDataSchema = z.object({
  heading: z.string().default(""),
  category: z.string().default(""),
  mode: z.enum(["auto", "manual"]).default("auto"),
  limit: z.number().int().min(1).max(24).default(6),
  projectIds: z.array(z.string()).default([]),
});

export const articleGridDataSchema = z.object({
  heading: z.string().default(""),
  mode: z.enum(["auto", "manual"]).default("auto"),
  limit: z.number().int().min(1).max(24).default(3),
  postIds: z.array(z.string()).default([]),
});

export const ctaDataSchema = z.object({
  heading: z.string().min(1, "Bắt buộc").default("Bạn cần tư vấn giải pháp marketing?"),
  body: z.string().default(""),
  buttonText: z.string().default(""),
  buttonLink: z.string().default(""),
});

export const contactFormFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "email", "tel", "textarea", "select"]).default("text"),
  required: z.boolean().default(false),
  options: z.string().default(""), // comma-separated, only used when type === "select"
});

export const contactFormDataSchema = z.object({
  heading: z.string().default(""),
  subheading: z.string().default(""),
  submitEmail: z.string().default(""),
  customFields: z.array(contactFormFieldSchema).default([]),
});

export const richTextDataSchema = z.object({
  html: z.string().default(""),
});

export const imageGalleryDataSchema = z.object({
  heading: z.string().default(""),
  images: z.array(z.object({ imageUrl: z.string().min(1), caption: z.string().default("") })).default([]),
});

export const statsDataSchema = z.object({
  heading: z.string().default(""),
  items: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
});

export const testimonialsDataSchema = z.object({
  heading: z.string().default(""),
  items: z
    .array(
      z.object({
        quote: z.string(),
        author: z.string(),
        role: z.string().default(""),
        avatarUrl: z.string().default(""),
      }),
    )
    .default([]),
});

export const sectionDataSchemas = {
  hero: heroDataSchema,
  aboutPreview: aboutPreviewDataSchema,
  logoGrid: logoGridDataSchema,
  projectGrid: projectGridDataSchema,
  projectBrandGrid: projectGridDataSchema,
  projectProductGrid: projectGridDataSchema,
  articleGrid: articleGridDataSchema,
  cta: ctaDataSchema,
  contactForm: contactFormDataSchema,
  richText: richTextDataSchema,
  imageGallery: imageGalleryDataSchema,
  stats: statsDataSchema,
  testimonials: testimonialsDataSchema,
} as const;

export type SectionType = keyof typeof sectionDataSchemas;

export type SectionDataMap = {
  [K in SectionType]: z.infer<(typeof sectionDataSchemas)[K]>;
};

export type Section = {
  [K in SectionType]: {
    id: string;
    type: K;
    order: number;
    title: string;
    hidden: boolean;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    data: SectionDataMap[K];
  };
}[SectionType];

export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;

export const SECTION_TYPE_META: Record<SectionType, { label: string; description: string }> = {
  hero: { label: "Hero", description: "Banner lớn đầu trang với tiêu đề và nút CTA" },
  aboutPreview: { label: "Giới thiệu ngắn", description: "Đoạn mô tả kèm ảnh và liên kết" },
  logoGrid: { label: "Logo khách hàng", description: "Hiển thị logo khách hàng/đối tác" },
  projectGrid: { label: "Dự án nổi bật", description: "Danh sách dự án tự động hoặc chọn tay" },
  projectBrandGrid: { label: "Dự án Nhân hiệu", description: "Section dự án theo danh mục Nhân hiệu" },
  projectProductGrid: { label: "Dự án Phẩm hiệu", description: "Section dự án theo danh mục Phẩm hiệu" },
  articleGrid: { label: "Bài viết mới nhất", description: "Danh sách bài viết tự động hoặc chọn tay" },
  cta: { label: "Kêu gọi hành động", description: "Khối nhấn mạnh thông điệp kèm nút bấm" },
  contactForm: { label: "Form liên hệ", description: "Form thu thập thông tin khách hàng" },
  richText: { label: "Văn bản tự do", description: "Nội dung định dạng tự do" },
  imageGallery: { label: "Thư viện ảnh", description: "Lưới hình ảnh" },
  stats: { label: "Số liệu nổi bật", description: "Các con số ấn tượng" },
  testimonials: { label: "Đánh giá khách hàng", description: "Trích dẫn phản hồi từ khách hàng" },
};

export const SECTION_TYPES = Object.keys(SECTION_TYPE_META) as SectionType[];

export function defaultSectionData<T extends SectionType>(type: T): SectionDataMap[T] {
  if (type === "projectBrandGrid") {
    return projectGridDataSchema.parse({ heading: "Dự án Nhân hiệu", category: "du-an-nhan-hieu" }) as SectionDataMap[T];
  }

  if (type === "projectProductGrid") {
    return projectGridDataSchema.parse({ heading: "Dự án Phẩm hiệu", category: "du-an-pham-hieu" }) as SectionDataMap[T];
  }

  return sectionDataSchemas[type].parse({}) as SectionDataMap[T];
}

export function createSection<T extends SectionType>(type: T, order: number, id: string): SectionOf<T> {
  return {
    id,
    type,
    order,
    title: "",
    hidden: false,
    backgroundColor: "",
    textColor: "",
    accentColor: "",
    data: defaultSectionData(type),
  } as unknown as SectionOf<T>;
}
