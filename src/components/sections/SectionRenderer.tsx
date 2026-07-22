import type { Section } from "@/lib/schema/sections";
import { Hero } from "./Hero";
import { AboutPreview } from "./AboutPreview";
import { LogoGrid } from "./LogoGrid";
import { ProjectGrid } from "./ProjectGrid";
import { ArticleGrid } from "./ArticleGrid";
import { Cta } from "./Cta";
import { ContactForm } from "./ContactForm";
import { RichText } from "./RichText";
import { ImageGallery } from "./ImageGallery";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";

export function SectionRenderer({ section }: { section: Section }) {
  if (section.hidden) return null;

  switch (section.type) {
    case "hero":
      return <Hero data={section.data} />;
    case "aboutPreview":
      return <AboutPreview data={section.data} />;
    case "logoGrid":
      return <LogoGrid data={section.data} />;
    case "projectGrid":
    case "projectBrandGrid":
    case "projectProductGrid":
      return <ProjectGrid data={section.data} />;
    case "articleGrid":
      return <ArticleGrid data={section.data} />;
    case "cta":
      return <Cta data={section.data} />;
    case "contactForm":
      return <ContactForm data={section.data} />;
    case "richText":
      return <RichText data={section.data} />;
    case "imageGallery":
      return <ImageGallery data={section.data} />;
    case "stats":
      return <Stats data={section.data} />;
    case "testimonials":
      return <Testimonials data={section.data} />;
    default:
      return null;
  }
}

export function SectionList({ sections }: { sections: Section[] }) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  return (
    <>
      {sorted.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
