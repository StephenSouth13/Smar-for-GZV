import Image from "next/image";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function LogoGrid({ data }: { data: SectionDataMap["logoGrid"] }) {
  if (data.logos.length === 0) return null;

  return (
    <section className="py-16 bg-surface">
      <Container>
        {data.heading && (
          <h2 className="text-center text-xl sm:text-2xl font-bold text-ink mb-10">{data.heading}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {data.logos.map((logo, i) => {
            const content = (
              <div className="flex h-20 items-center justify-center rounded-xl border border-line/70 bg-white px-4 grayscale transition-all hover:grayscale-0">
                <div className="relative h-10 w-full">
                  <Image src={logo.imageUrl} alt={logo.name} fill className="object-contain" unoptimized />
                </div>
              </div>
            );
            return logo.link ? (
              <a key={i} href={logo.link} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
