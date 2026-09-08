import { Curriculum } from "./components/curriculum";
import { Faq } from "./components/faq";
import { Features } from "./components/features";
import { FinalCta } from "./components/final-cta";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { Testimonials } from "./components/testimonials";
import { ToolMarquee } from "./components/tool-marquee";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ToolMarquee />
        <Curriculum />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
