import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

export function AboutPreview({ data }: { data: SectionDataMap["aboutPreview"] }) {
  return (
    <section className="bg-[#0b0b0b] py-20 text-white">
      <Container className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-brand-accent">Về GZV</span>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{data.heading}</h2>
          {data.body && <p className="mt-4 whitespace-pre-line leading-relaxed text-white/68">{data.body}</p>}
          {data.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {data.links.map((link, i) => (
                <Link key={i} href={link.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:text-white">
                  {link.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-white/10 bg-surface">
          {data.imageUrl ? (
            <Image src={cld(data.imageUrl, { width: 800, height: 600 })} alt={data.heading} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/50">Chưa có ảnh</div>
          )}
        </div>
      </Container>
    </section>
  );
}
