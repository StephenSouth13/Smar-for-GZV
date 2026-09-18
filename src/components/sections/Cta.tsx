import Link from "next/link";
import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Cta({ data }: { data: SectionDataMap["cta"] }) {
  return (
    <section className="bg-black py-20">
      <Container>
        <div className="theme-on-brand rounded-md border border-brand/40 bg-[linear-gradient(135deg,rgba(237,28,36,.95),rgba(80,0,0,.92))] px-8 py-14 text-center text-white sm:px-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold sm:text-3xl">{data.heading}</h2>
          {data.body && <p className="mx-auto mt-4 max-w-xl text-white/85">{data.body}</p>}
          {data.buttonText && (
            <div className="mt-8">
              <Link
                href={data.buttonLink || "#"}
                className="inline-flex items-center justify-center rounded-md bg-white px-7 py-3.5 text-sm font-bold text-black shadow-lg transition-colors hover:bg-white/88"
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
