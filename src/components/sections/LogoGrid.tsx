import Image from "next/image";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

function LogoTile({ logo }: { logo: SectionDataMap["logoGrid"]["logos"][number] }) {
  const content = (
    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-white px-4 grayscale transition-all hover:grayscale-0">
      <div className="relative h-10 w-full">
        <Image src={logo.imageUrl} alt={logo.name} fill className="object-contain" unoptimized />
      </div>
    </div>
  );
  return logo.link ? (
    <a href={logo.link} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}

export function LogoGrid({ data }: { data: SectionDataMap["logoGrid"] }) {
  if (data.logos.length === 0) return null;

  // Duplicate the strip so the CSS animation can loop seamlessly from 0% to -50%.
  const track = [...data.logos, ...data.logos];

  return (
    <section className="py-16 bg-surface overflow-hidden">
      <Container>
        {data.heading && (
          <h2 className="text-center text-xl sm:text-2xl font-bold text-ink mb-10">{data.heading}</h2>
        )}
      </Container>
      <div
        className="group relative w-full overflow-hidden"
        style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
      >
        <div className="flex w-max animate-marquee gap-6 group-hover:paused">
          {track.map((logo, i) => (
            <LogoTile key={i} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
