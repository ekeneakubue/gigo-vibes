import { Curriculum } from "./components/curriculum";
import { Faq } from "./components/faq";
import { Features } from "./components/features";
import { FinalCta } from "./components/final-cta";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { TechStack } from "./components/tech-stack";
import { Testimonials } from "./components/testimonials";
import { ToolMarquee } from "./components/tool-marquee";
import { listPublishedCurriculumModules } from "./lib/curriculum";
import { listPublishedFaqs } from "./lib/faqs";
import { listPublishedTechStackItems } from "./lib/tech-stack";

export const dynamic = "force-dynamic";

export default async function Home() {
  let modules: Awaited<ReturnType<typeof listPublishedCurriculumModules>> = [];
  let techItems: Awaited<ReturnType<typeof listPublishedTechStackItems>> = [];
  let faqs: Awaited<ReturnType<typeof listPublishedFaqs>> = [];

  try {
    modules = await listPublishedCurriculumModules();
  } catch {
    modules = [];
  }

  try {
    techItems = await listPublishedTechStackItems();
  } catch {
    techItems = [];
  }

  try {
    faqs = await listPublishedFaqs();
  } catch {
    faqs = [];
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ToolMarquee />
        <TechStack items={techItems} />
        <Curriculum modules={modules} />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Faq items={faqs} />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
