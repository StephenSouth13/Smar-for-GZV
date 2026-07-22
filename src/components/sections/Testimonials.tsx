import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Testimonials({ data }: { data: SectionDataMap["testimonials"] }) {
  if (data.items.length === 0) return null;
  return (
    <section className="py-20 bg-surface">
      <Container>
        {data.heading && <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-10 text-center">{data.heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((item, i) => (
            <figure key={i} className="rounded-2xl bg-white border border-line/70 p-6">
              <Quote className="h-6 w-6 text-brand/60" />
              <blockquote className="mt-3 text-sm text-ink-muted leading-relaxed">{item.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-brand/10">
                  {item.avatarUrl && (
                    <Image src={item.avatarUrl} alt={item.author} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{item.author}</div>
                  {item.role && <div className="text-xs text-ink-muted">{item.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
