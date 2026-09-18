import Image from "next/image";
import { Quote } from "lucide-react";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Testimonials({ data }: { data: SectionDataMap["testimonials"] }) {
  if (data.items.length === 0) return null;
  return (
    <section className="bg-[#111111] py-20">
      <Container>
        {data.heading && <h2 className="mb-10 text-center text-2xl font-bold text-white sm:text-3xl">{data.heading}</h2>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {data.items.map((item, i) => (
            <figure key={i} className="rounded-md border border-white/10 bg-black p-6">
              <Quote className="h-6 w-6 text-brand-accent" />
              <blockquote className="mt-3 text-sm leading-relaxed text-white/65">{item.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-brand/15">
                  {item.avatarUrl && <Image src={cld(item.avatarUrl, { width: 80, height: 80, gravity: "face" })} alt={item.author} fill className="object-cover" unoptimized />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.author}</div>
                  {item.role && <div className="text-xs text-white/50">{item.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
