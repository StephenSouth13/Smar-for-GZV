import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function Stats({ data }: { data: SectionDataMap["stats"] }) {
  if (data.items.length === 0) return null;
  return (
    <section className="py-16 bg-ink text-white">
      <Container>
        {data.heading && <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">{data.heading}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {data.items.map((item, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-bold text-brand">{item.value}</div>
              <div className="mt-2 text-sm text-white/70">{item.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
