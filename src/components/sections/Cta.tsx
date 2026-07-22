import Link from "next/link";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Cta({ data }: { data: SectionDataMap["cta"] }) {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-8 py-14 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl text-2xl sm:text-3xl font-bold">{data.heading}</h2>
          {data.body && <p className="mx-auto mt-4 max-w-xl text-white/85">{data.body}</p>}
          {data.buttonText && (
            <div className="mt-8">
              <Link
                href={data.buttonLink || "#"}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-dark shadow-lg transition-transform hover:scale-[1.03]"
              >
                {data.buttonText}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
