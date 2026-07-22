import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

export function AboutPreview({ data }: { data: SectionDataMap["aboutPreview"] }) {
  return (
    <section className="py-20">
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-brand">Về GZV</span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-ink">{data.heading}</h2>
          {data.body && <p className="mt-4 text-ink-muted leading-relaxed whitespace-pre-line">{data.body}</p>}
          {data.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {data.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:text-brand"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface">
          {data.imageUrl ? (
            <Image
              src={cld(data.imageUrl, { width: 800, height: 600 })}
              alt={data.heading}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-muted text-sm">Chưa có ảnh</div>
          )}
        </div>
      </Container>
    </section>
  );
}
