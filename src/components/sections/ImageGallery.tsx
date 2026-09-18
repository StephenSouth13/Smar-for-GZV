import Image from "next/image";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

export function ImageGallery({ data }: { data: SectionDataMap["imageGallery"] }) {
  if (data.images.length === 0) return null;
  return (
    <section className="bg-[#0b0b0b] py-16">
      <Container>
        {data.heading && <h2 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">{data.heading}</h2>}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.images.map((img, i) => (
            <figure key={i} className="overflow-hidden rounded-md border border-white/10 bg-[#111111]">
              <div className="relative aspect-square">
                <Image src={cld(img.imageUrl, { width: 600, height: 600 })} alt={img.caption || ""} fill className="object-cover" unoptimized />
              </div>
              {img.caption && <figcaption className="p-2 text-center text-xs text-white/55">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
