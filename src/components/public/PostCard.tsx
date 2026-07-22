import Link from "next/link";
import Image from "next/image";
import { cld } from "@/lib/image-url";
import type { PostDoc } from "@/lib/data/posts";

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return "";
  }
}

export function PostCard({ post }: { post: PostDoc }) {
  return (
    <Link
      href={`/chia-se/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line/70 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        {post.coverImageUrl ? (
          <Image
            src={cld(post.coverImageUrl, { width: 800, height: 500 })}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted text-sm">Chưa có ảnh</div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          {post.category && <span className="font-medium text-brand-dark">{post.category}</span>}
          {post.category && post.publishedAt && <span>•</span>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
        <h3 className="mt-2 font-semibold text-ink group-hover:text-brand-dark transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-1.5 text-sm text-ink-muted line-clamp-2">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
