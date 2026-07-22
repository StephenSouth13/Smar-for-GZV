import Image from "next/image";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function ImageGallery({ data }: { data: SectionDataMap["imageGallery"] }) {
  if (data.images.length === 0) return null;
  return (
    <section className="py-16">
      <Container>
        {data.heading && <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-8 text-center">{data.heading}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.images.map((img, i) => (
            <figure key={i} className="overflow-hidden rounded-xl bg-surface">
              <div className="relative aspect-square">
                <Image src={img.imageUrl} alt={img.caption || ""} fill className="object-cover" unoptimized />
              </div>
              {img.caption && <figcaption className="p-2 text-center text-xs text-ink-muted">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
