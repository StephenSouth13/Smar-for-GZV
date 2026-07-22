"use client";

import { useMemo, useState } from "react";
import { Newspaper, Search, SlidersHorizontal } from "lucide-react";
import { PostCard } from "@/components/public/PostCard";
import { cn } from "@/lib/utils";
import type { PostDoc } from "@/lib/data/posts";

export function PostFilterGrid({ posts }: { posts: PostDoc[] }) {
  const categories = useMemo(() => Array.from(new Set(posts.map((post) => post.category).filter(Boolean))), [posts]);
  const [activeCategory, setActiveCategory] = useState("");
  const [query, setQuery] = useState("");

  const visible = posts.filter((post) => {
    const matchCategory = activeCategory ? post.category === activeCategory : true;
    const haystack = `${post.title} ${post.excerpt} ${post.category} ${post.author}`.toLowerCase();
    const matchQuery = query.trim() ? haystack.includes(query.trim().toLowerCase()) : true;
    return matchCategory && matchQuery;
  });

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line/70 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bài viết, chuyên mục, tác giả..."
              className="h-11 w-full rounded-lg border border-line/70 bg-surface pl-10 pr-3 text-sm outline-none transition-colors focus:border-brand/60 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
            <SlidersHorizontal className="h-4 w-4" />
            {visible.length}/{posts.length} bài viết
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("")}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                activeCategory === "" ? "border-brand bg-brand text-white" : "border-line/70 bg-white text-ink hover:border-brand/50",
              )}
            >
              <Newspaper className="h-4 w-4" />
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                  activeCategory === category
                    ? "border-brand bg-brand text-white"
                    : "border-line/70 bg-white text-ink hover:border-brand/50",
                )}
              >
                <Newspaper className="h-4 w-4" />
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center text-ink-muted">
          Chưa có bài viết phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
