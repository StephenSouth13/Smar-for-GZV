import Link from "next/link";
import Image from "next/image";
import { cld } from "@/lib/image-url";
import type { PostDoc } from "@/lib/data/posts";
import type { SettingsInput } from "@/lib/schema/content";

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function PostCard({ post, categories = [] }: { post: PostDoc; categories?: SettingsInput["postCategories"] }) {
  const categoryLabel = post.category ? categories.find((category) => category.slug === post.category)?.label || post.category : "";

  return (
    <Link href={`/chia-se/${post.slug}`} className="group block overflow-hidden rounded-md border border-white/10 bg-[#111111] transition-all hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl hover:shadow-brand/10">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#161616]">
        {post.coverImageUrl ? (
          <Image
            src={cld(post.coverImageUrl, { width: 800, height: 500 })}
            alt={post.title}
            fill
            className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/45">Chưa có ảnh</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-white/50">
          {categoryLabel && <span className="font-medium text-brand-accent">{categoryLabel}</span>}
          {categoryLabel && post.publishedAt && <span>•</span>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold text-white transition-colors group-hover:text-brand-accent">{post.title}</h3>
        {post.excerpt && <p className="mt-1.5 line-clamp-2 text-sm text-white/58">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
