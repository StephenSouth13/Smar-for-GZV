import type { Section } from "@/lib/schema/sections";
import { HeroEditor } from "./HeroEditor";
import { AboutPreviewEditor } from "./AboutPreviewEditor";
import { LogoGridEditor } from "./LogoGridEditor";
import { ProjectGridEditor } from "./ProjectGridEditor";
import { ArticleGridEditor } from "./ArticleGridEditor";
import { CtaEditor } from "./CtaEditor";
import { ContactFormEditor } from "./ContactFormEditor";
import { RichTextSectionEditor } from "./RichTextSectionEditor";
import { ImageGalleryEditor } from "./ImageGalleryEditor";
import { StatsEditor } from "./StatsEditor";
import { TestimonialsEditor } from "./TestimonialsEditor";

export function SectionEditor({
  section,
  onChange,
}: {
  section: Section;
  onChange: (data: Section["data"]) => void;
}) {
  switch (section.type) {
    case "hero":
      return <HeroEditor data={section.data} onChange={onChange} />;
    case "aboutPreview":
      return <AboutPreviewEditor data={section.data} onChange={onChange} />;
    case "logoGrid":
      return <LogoGridEditor data={section.data} onChange={onChange} />;
    case "projectGrid":
      return <ProjectGridEditor data={section.data} onChange={onChange} />;
    case "articleGrid":
      return <ArticleGridEditor data={section.data} onChange={onChange} />;
    case "cta":
      return <CtaEditor data={section.data} onChange={onChange} />;
    case "contactForm":
      return <ContactFormEditor data={section.data} onChange={onChange} />;
    case "richText":
      return <RichTextSectionEditor data={section.data} onChange={onChange} />;
    case "imageGallery":
      return <ImageGalleryEditor data={section.data} onChange={onChange} />;
    case "stats":
      return <StatsEditor data={section.data} onChange={onChange} />;
    case "testimonials":
      return <TestimonialsEditor data={section.data} onChange={onChange} />;
    default:
      return null;
  }
}
