import { Fragment, type ReactNode } from "react";
import { SECTIONS, type SectionId } from "@/content/sections";
import { FeatherDrops } from "@/features/feathers/FeatherDrops";
import { HeroBackdrop } from "@/features/hero/backdrop/HeroBackdrop";
import { Hero } from "@/features/hero/Hero";
import { Navbar } from "@/features/navbar/Navbar";
import { EdgeHint } from "@/features/panels/EdgeHint";
import { Pager } from "@/features/panels/Pager";
import { PanelStage } from "@/features/panels/PanelStage";
import { AboutSection } from "@/sections/AboutSection";
import { ContactSection } from "@/sections/contact/ContactSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { ProjectsSection } from "@/sections/projects/ProjectsSection";
import { ServicesSection } from "@/sections/ServicesSection";
import { UpcomingSection } from "@/sections/UpcomingSection";

/** Contenido de cada panel. El orden lo define SECTIONS, que también usan el navbar y el menú. */
const PANELS: Record<SectionId, ReactNode> = {
  inicio: <Hero backdrop={<HeroBackdrop />} />,
  nosotros: <AboutSection />,
  servicios: <ServicesSection />,
  proyectos: <ProjectsSection />,
  proximamente: <UpcomingSection />,
  proceso: <ProcessSection />,
  contacto: <ContactSection />,
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Pager />
      <EdgeHint />
      <FeatherDrops />
      <PanelStage>
        {SECTIONS.map(({ id }) => (
          <Fragment key={id}>{PANELS[id]}</Fragment>
        ))}
      </PanelStage>
    </>
  );
}
