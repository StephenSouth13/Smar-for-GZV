import Image from "next/image";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

type Logo = SectionDataMap["logoGrid"]["logos"][number];

function LogoTile({ logo, compact = false }: { logo: Logo; compact?: boolean }) {
  const content = (
    <div className={compact ? "flex h-28 w-56 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white px-7" : "group flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-[#111111] transition-all hover:-translate-y-1 hover:border-brand/60"}>
      <div className={compact ? "relative h-16 w-full" : "relative flex h-40 items-center justify-center bg-white p-7 sm:h-44"}>
        <Image
          src={cld(logo.imageUrl, { width: compact ? 320 : 520, height: compact ? 128 : 260, crop: "fit" })}
          alt={logo.name || "Logo khách hàng"}
          fill
          className="object-contain p-7 transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      {!compact && (
        <div className="flex min-h-18 flex-1 items-center justify-center px-4 py-4 text-center">
          <div className="text-sm font-extrabold uppercase tracking-wide text-white sm:text-base">{logo.name || "Khách hàng"}</div>
        </div>
      )}
    </div>
  );

  return logo.link ? (
    <a href={logo.link} target="_blank" rel="noopener noreferrer" aria-label={logo.name || "Logo khách hàng"}>
      {content}
    </a>
  ) : (
    content
  );
}

export function LogoGrid({ data }: { data: SectionDataMap["logoGrid"] }) {
  if (data.logos.length === 0) return null;

  const heading = data.heading || "Đối tác";

  if (data.carousel) {
    const track = [...data.logos, ...data.logos, ...data.logos];
    return (
      <section className="overflow-hidden bg-black py-20">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">Partners</div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{heading}</h2>
          </div>
        </Container>
        <div className="group relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)" }}>
          <div className="flex w-max animate-marquee gap-5 px-5 group-hover:paused">
            {track.map((logo, i) => (
              <LogoTile key={`${logo.imageUrl}-${i}`} logo={logo} compact />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black py-18 sm:py-20">
      <Container>
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">Partners</span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{heading}</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {data.logos.map((logo, i) => (
            <LogoTile key={`${logo.imageUrl}-${i}`} logo={logo} />
          ))}
        </div>
      </Container>
    </section>
  );
}
