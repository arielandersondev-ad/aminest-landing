import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "./ContactForm";
import { SiteFooter } from "./SiteFooter";
import styles from "./ContactSection.module.css";

function EggDecoration() {
  return (
    <svg viewBox="0 0 120 120" className={`decoration ${styles.egg}`} aria-hidden="true">
      <polygon points="60,10 84,26 95,56 88,90 60,108 32,90 25,56 36,26" fill="var(--lg1)" />
      <polygon points="60,62 60,10 84,26" fill="var(--lg2)" />
      <polygon points="60,62 95,56 88,90" fill="var(--lg2)" />
      <polygon points="60,62 60,108 32,90" fill="var(--lg3)" />
      <polygon points="60,62 25,56 36,26" fill="var(--lg3)" />
    </svg>
  );
}

/* El pie va dentro del último panel: en la pista horizontal no hay un "final de página" aparte. */
export function ContactSection() {
  return (
    <Section
      id="contacto"
      align="start"
      containerClassName={styles.layout}
      decoration={<EggDecoration />}
    >
      <SectionHeader
        className={styles.header}
        eyebrow="Contacto"
        title="Cuéntanos qué necesitas"
        description="Te respondemos con una propuesta inicial, sin compromiso. Si ya tienes una idea a medias, también nos sirve."
      />
      <ContactForm />
      <SiteFooter className={styles.footer} />
    </Section>
  );
}
