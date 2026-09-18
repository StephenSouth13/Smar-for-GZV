import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Stats({ data }: { data: SectionDataMap["stats"] }) {
  if (data.items.length === 0) return null;
  return (
    <section className="border-y border-white/10 bg-black py-16 text-white">
      <Container>
        {data.heading && <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{data.heading}</h2>}
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {data.items.map((item, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-brand-accent sm:text-4xl">{item.value}</div>
              <div className="mt-2 text-sm text-white/70">{item.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
