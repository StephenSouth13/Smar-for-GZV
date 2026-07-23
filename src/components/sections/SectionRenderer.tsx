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

  const style = {
    ...(section.backgroundColor ? { "--surface": section.backgroundColor, backgroundColor: section.backgroundColor } : {}),
    ...(section.textColor ? { "--ink": section.textColor, color: section.textColor } : {}),
    ...(section.accentColor ? { "--brand": section.accentColor, "--brand-dark": section.accentColor } : {}),
  } as React.CSSProperties;

  let content: React.ReactNode = null;

  switch (section.type) {
    case "hero":
      content = <Hero data={section.data} />;
      break;
    case "aboutPreview":
      content = <AboutPreview data={section.data} />;
      break;
    case "logoGrid":
      content = <LogoGrid data={section.data} />;
      break;
    case "projectGrid":
      content = <ProjectGrid data={section.data} />;
      break;
    case "articleGrid":
      content = <ArticleGrid data={section.data} />;
      break;
    case "cta":
      content = <Cta data={section.data} />;
      break;
    case "contactForm":
      content = <ContactForm data={section.data} />;
      break;
    case "richText":
      content = <RichText data={section.data} />;
      break;
    case "imageGallery":
      content = <ImageGallery data={section.data} />;
      break;
    case "stats":
      content = <Stats data={section.data} />;
      break;
    case "testimonials":
      content = <Testimonials data={section.data} />;
      break;
    default:
      return null;
  }

  return (
    <div className="cms-section-shell" style={style}>
      {content}
    </div>
  );
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
