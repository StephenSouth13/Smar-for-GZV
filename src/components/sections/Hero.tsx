import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Hero({ data }: { data: SectionDataMap["hero"] }) {
  return (
    <section
      className="relative overflow-hidden bg-ink text-white"
      style={
        data.backgroundImageUrl
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(50,55,60,.88), rgba(50,55,60,.92)), url(${data.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(57,181,74,.25),transparent_45%)]" />
      <Container className="relative py-24 sm:py-32 text-center">
        <h1 className="mx-auto max-w-3xl text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
          {data.heading}
        </h1>
        {data.subheading && (
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-white/80">{data.subheading}</p>
        )}
        {data.ctaText && (
          <div className="mt-9">
            <Link
              href={data.ctaLink || "#"}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition-transform hover:scale-[1.03] hover:bg-brand-dark"
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
