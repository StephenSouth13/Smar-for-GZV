import Image from "next/image";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

function LogoTile({ logo }: { logo: SectionDataMap["logoGrid"]["logos"][number] }) {
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

export function LogoGrid({ data }: { data: SectionDataMap["logoGrid"] }) {
  if (data.logos.length === 0) return null;

  const heading = data.heading || "Khách hàng đã tin tưởng đồng hành";

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
            <LogoTile key={`${logo.imageUrl}-${i}`} logo={logo} />
          ))}
        </div>
      </Container>
    </section>
  );
}
