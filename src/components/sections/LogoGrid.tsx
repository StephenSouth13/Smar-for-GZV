import Image from "next/image";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

type Logo = SectionDataMap["logoGrid"]["logos"][number];

function GridTile({ logo }: { logo: Logo }) {
  const content = (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-line/70 bg-white shadow-md shadow-black/10 transition-all hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl">
      <div className="relative flex h-40 items-center justify-center border-b border-line/60 bg-white p-7 sm:h-44">
        <Image
          src={cld(logo.imageUrl, { width: 520, height: 260, crop: "fit" })}
          alt={logo.name || "Logo khách hàng"}
          fill
          className="object-contain p-7 transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="flex min-h-18 flex-1 items-center justify-center px-4 py-4 text-center">
        <div className="text-sm font-extrabold uppercase tracking-wide text-ink sm:text-base">{logo.name || "Khách hàng"}</div>
      </div>
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

function CarouselTile({ logo }: { logo: Logo }) {
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

  if (data.carousel) {
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
              <CarouselTile key={`${logo.imageUrl}-${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface py-18 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-dark">Partners</span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{heading}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {data.logos.map((logo, i) => (
            <GridTile key={`${logo.imageUrl}-${i}`} logo={logo} />
          ))}
        </div>
      </Container>
    </section>
  );
}
