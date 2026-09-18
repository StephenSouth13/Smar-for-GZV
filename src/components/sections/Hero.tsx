import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import { cld } from "@/lib/image-url";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Hero({ data }: { data: SectionDataMap["hero"] }) {
  if (data.imageOnly && data.backgroundImageUrl) {
    const banner = (
      <Link href={data.ctaLink || "#"} className={data.ctaLink ? "block" : "pointer-events-none block"}>
        <Image
          src={cld(data.backgroundImageUrl, { width: 1920 })}
          alt={data.heading || "Banner"}
          width={1920}
          height={800}
          className="h-auto w-full"
          unoptimized
          priority
        />
      </Link>
    );

    return (
      <section className="bg-black">
        {data.imageFullBleed ? banner : <Container className="px-0 sm:px-0 lg:px-0">{banner}</Container>}
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden bg-black text-white"
      style={
        data.backgroundImageUrl
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.72), rgba(0,0,0,.92)), url(${cld(data.backgroundImageUrl, { width: 1920, height: 1080 })})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(237,28,36,.28),transparent_34%),linear-gradient(135deg,rgba(237,28,36,.12),transparent_42%)]" />
      <Container className="relative py-24 text-center sm:py-32">
        <div className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-brand-accent">The Next-Gen Company</div>
        <h1
          className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl"
          style={data.headingColor ? { color: data.headingColor } : undefined}
        >
          {data.heading}
        </h1>
        {data.subheading && (
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg"
            style={data.subheadingColor ? { color: data.subheadingColor } : undefined}
          >
            {data.subheading}
          </p>
        )}
        {data.ctaText && (
          <div className="mt-9">
            <Link
              href={data.ctaLink || "#"}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-colors hover:bg-brand-dark"
            >
              {data.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
