/**
 * Seeds Firestore with placeholder content matching the smar.vn theme layout,
 * so the site is immediately browsable after setup. Replace everything via
 * /admin afterwards. Requires FIREBASE_ADMIN_* credentials in .env.local.
 *
 * Usage: npm run seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { nanoid } from "nanoid";
import { createSection, type SectionOf, type SectionType } from "../src/lib/schema/sections";
import { savePage } from "../src/lib/data/pages";
import { createProject } from "../src/lib/data/projects";
import { createPost } from "../src/lib/data/posts";
import { saveSiteSettings } from "../src/lib/data/settings";

const ph = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/39b54a/ffffff?text=${encodeURIComponent(text)}`;

function section<T extends SectionType>(type: T, order: number, data: Partial<SectionOf<T>["data"]>): SectionOf<T> {
  const base = createSection(type, order, nanoid(8));
  return { ...base, data: { ...base.data, ...data } };
}

async function seedSettings() {
  await saveSiteSettings({
    siteName: "GZV",
    tagline: "Solution For Marketing",
    logoUrl: "",
    contactEmail: "hello@gzv.one",
    contactPhone: "0900 000 000",
    address: "TP. Hồ Chí Minh, Việt Nam",
    socialFacebook: "https://facebook.com",
    socialYoutube: "https://youtube.com",
    socialZalo: "https://zalo.me",
    headerMenu: [
      { label: "Trang chủ", href: "/" },
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Dự án", href: "/du-an" },
      { label: "Chia sẻ", href: "/chia-se" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
    footerText: "GZV đồng hành cùng doanh nghiệp với giải pháp marketing toàn diện: Content, Design, Media, Performance, Website.",
  });
  console.log("Seeded settings/site");
}

async function seedHomePage() {
  await savePage("home", {
    title: "Trang chủ",
    seoTitle: "GZV - Giải pháp Marketing toàn diện",
    seoDescription: "GZV đồng hành cùng doanh nghiệp với giải pháp marketing toàn diện: Content, Design, Media, Performance, Website.",
    published: true,
    sections: [
      section("hero", 0, {
        heading: "Giải pháp Marketing toàn diện cho doanh nghiệp",
        subheading: "GZV đồng hành cùng bạn từ chiến lược, nội dung, thiết kế đến vận hành hiệu suất.",
        ctaText: "Yêu cầu tư vấn",
        ctaLink: "/lien-he",
      }),
      section("logoGrid", 1, {
        heading: "Khách hàng đã tin tưởng đồng hành",
        logos: Array.from({ length: 6 }, (_, i) => ({
          imageUrl: ph(200, 100, `Logo ${i + 1}`),
          name: `Khách hàng ${i + 1}`,
          link: "",
        })),
      }),
      section("aboutPreview", 2, {
        heading: "Về GZV",
        body: "GZV là đối tác marketing toàn diện, giúp doanh nghiệp xây dựng thương hiệu và tăng trưởng bền vững thông qua Content, Design, Media, Performance và Website.",
        imageUrl: ph(800, 600, "GZV"),
        links: [{ label: "Tìm hiểu thêm", href: "/gioi-thieu" }],
      }),
      section("projectGrid", 3, { heading: "Dự án nổi bật", mode: "auto", limit: 6, projectIds: [] }),
      section("articleGrid", 4, { heading: "Bài viết mới nhất", mode: "auto", limit: 3, postIds: [] }),
      section("cta", 5, {
        heading: "Sẵn sàng tăng trưởng cùng GZV?",
        body: "Liên hệ ngay để nhận tư vấn giải pháp marketing phù hợp với doanh nghiệp của bạn.",
        buttonText: "Liên hệ ngay",
        buttonLink: "/lien-he",
      }),
      section("contactForm", 6, {
        heading: "Yêu cầu tư vấn",
        subheading: "Để lại thông tin, đội ngũ GZV sẽ liên hệ trong thời gian sớm nhất.",
        submitEmail: "hello@gzv.one",
      }),
    ],
  });
  console.log("Seeded pages/home");
}

async function seedAboutPage() {
  await savePage("gioi-thieu", {
    title: "Giới thiệu",
    seoTitle: "Giới thiệu về GZV",
    seoDescription: "Tìm hiểu về GZV - đối tác marketing toàn diện cho doanh nghiệp.",
    published: true,
    sections: [
      section("aboutPreview", 0, {
        heading: "Về chúng tôi",
        body: "GZV được thành lập với sứ mệnh đồng hành cùng doanh nghiệp Việt Nam trong hành trình xây dựng thương hiệu và tăng trưởng bền vững. Chúng tôi cung cấp giải pháp marketing toàn diện từ chiến lược, nội dung, thiết kế, sản xuất media đến tối ưu hiệu suất quảng cáo và phát triển website.",
        imageUrl: ph(800, 600, "Ve GZV"),
        links: [],
      }),
      section("stats", 1, {
        heading: "GZV qua những con số",
        items: [
          { value: "5+", label: "Năm kinh nghiệm" },
          { value: "50+", label: "Khách hàng" },
          { value: "100+", label: "Dự án hoàn thành" },
          { value: "20+", label: "Chuyên gia" },
        ],
      }),
      section("testimonials", 2, {
        heading: "Khách hàng nói gì về GZV",
        items: [
          { quote: "Đội ngũ GZV chuyên nghiệp, đồng hành sát sao và mang lại hiệu quả rõ rệt.", author: "Nguyễn Văn A", role: "Giám đốc Marketing", avatarUrl: "" },
          { quote: "Chiến lược nội dung sáng tạo, đúng insight khách hàng mục tiêu.", author: "Trần Thị B", role: "CEO", avatarUrl: "" },
        ],
      }),
      section("cta", 3, {
        heading: "Cùng GZV xây dựng thương hiệu của bạn",
        body: "Liên hệ để nhận tư vấn miễn phí về giải pháp marketing phù hợp.",
        buttonText: "Liên hệ ngay",
        buttonLink: "/lien-he",
      }),
    ],
  });
  console.log("Seeded pages/gioi-thieu");
}

const SAMPLE_PROJECTS = [
  { title: "Chiến dịch ra mắt thương hiệu Traminco Group", client: "Traminco Group", tags: ["Content", "Design"] },
  { title: "Tối ưu hiệu suất quảng cáo PT Logistics", client: "PT Logistics", tags: ["Performance"] },
  { title: "Sản xuất video thương hiệu FPI", client: "FPI", tags: ["Media"] },
  { title: "Thiết kế website nha khoa toàn diện", client: "Nha khoa Sunshine", tags: ["Website", "Design"] },
  { title: "Chiến lược nội dung mạng xã hội trung tâm thẩm mỹ", client: "Belle Beauty Center", tags: ["Content", "Media"] },
  { title: "Tái định vị thương hiệu và hệ thống nhận diện", client: "Green Retail", tags: ["Design", "Content"] },
];

async function seedProjects() {
  for (let i = 0; i < SAMPLE_PROJECTS.length; i++) {
    const p = SAMPLE_PROJECTS[i]!;
    await createProject({
      title: p.title,
      slug: `du-an-mau-${i + 1}`,
      coverImageUrl: ph(800, 600, p.tags[0] ?? "GZV"),
      gallery: [ph(800, 600, "Anh 1"), ph(800, 600, "Anh 2")],
      client: p.client,
      tags: p.tags,
      summary: `Dự án hợp tác cùng ${p.client}, triển khai giải pháp ${p.tags.join(", ")} giúp gia tăng nhận diện thương hiệu và hiệu quả kinh doanh.`,
      content: `<p>Đây là nội dung chi tiết mẫu cho dự án <strong>${p.title}</strong>. Hãy chỉnh sửa nội dung này trong trang quản trị /admin/projects.</p>`,
      order: i,
      featured: i < 3,
      published: true,
      seoTitle: "",
      seoDescription: "",
    });
  }
  console.log(`Seeded ${SAMPLE_PROJECTS.length} projects`);
}

const SAMPLE_POSTS = [
  { title: "5 xu hướng marketing nổi bật năm nay", category: "Xu hướng" },
  { title: "Cách xây dựng nội dung video bằng AI hiệu quả", category: "Content" },
  { title: "Tối ưu chi phí quảng cáo cho doanh nghiệp vừa và nhỏ", category: "Performance" },
];

async function seedPosts() {
  for (let i = 0; i < SAMPLE_POSTS.length; i++) {
    const p = SAMPLE_POSTS[i]!;
    const daysAgo = (SAMPLE_POSTS.length - i) * 3;
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    await createPost({
      title: p.title,
      slug: `bai-viet-mau-${i + 1}`,
      coverImageUrl: ph(800, 500, p.category),
      category: p.category,
      excerpt: `Bài viết mẫu về chủ đề ${p.category.toLowerCase()}. Hãy chỉnh sửa nội dung này trong trang quản trị /admin/posts.`,
      content: `<p>Đây là nội dung chi tiết mẫu cho bài viết <strong>${p.title}</strong>.</p>`,
      author: "GZV",
      published: true,
      publishedAt: date,
      seoTitle: "",
      seoDescription: "",
    });
  }
  console.log(`Seeded ${SAMPLE_POSTS.length} posts`);
}

async function main() {
  await seedSettings();
  await seedHomePage();
  await seedAboutPage();
  await seedProjects();
  await seedPosts();
  console.log("\nDone. Run `npm run create-admin -- --email=... --password=...` to create your admin login.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
