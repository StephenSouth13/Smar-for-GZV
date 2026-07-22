import Image from "next/image";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

function LogoTile({ logo }: { logo: SectionDataMap["logoGrid"]["logos"][number] }) {
  const content = (
    <div className="flex h-28 w-56 shrink-0 items-center justify-center rounded-lg border border-line/70 bg-white px-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md">
      <div className="relative h-16 w-full">
        <Image
          src={cld(logo.imageUrl, { width: 320, height: 128, crop: "fit" })}
          alt={logo.name || "Client logo"}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    </div>
  );

  return logo.link ? (
    <a href={logo.link} target="_blank" rel="noopener noreferrer" aria-label={logo.name || "Client logo"}>
      {content}
    </a>
  ) : (
    content
  );
}

export function LogoGrid({ data }: { data: SectionDataMap["logoGrid"] }) {
  if (data.logos.length === 0) return null;

  const heading = data.heading || "Khách hàng đã tin tưởng đồng hành";
  const track = [...data.logos, ...data.logos, ...data.logos];

  return (
    <section className="overflow-hidden bg-white py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">Partners</div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{heading}</h2>
        </div>
      </Container>
      <div
        className="group relative w-full overflow-hidden"
        style={{ maskImage: "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)" }}
      >
        <div className="flex w-max animate-marquee gap-5 px-5 group-hover:paused">
          {track.map((logo, i) => (
            <LogoTile key={`${logo.imageUrl}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
