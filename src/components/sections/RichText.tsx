import { Container } from "@/components/public/Container";
import type { SectionDataMap } from "@/lib/schema/sections";

export function RichText({ data }: { data: SectionDataMap["richText"] }) {
  if (!data.html) return null;
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: data.html }} />
      </Container>
    </section>
  );
}
