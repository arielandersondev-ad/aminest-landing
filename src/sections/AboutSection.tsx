import { PigeonMark } from "@/components/brand/Pigeon";
import { LinkButton } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeader";
import { sectionHref } from "@/content/sections";
import { ABOUT } from "@/content/site";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <Section
      id="nosotros"
      containerClassName={styles.content}
      decoration={<PigeonMark className={`decoration ${styles.pigeon}`} />}
    >
      <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
      <h2 className={styles.title}>
        {ABOUT.title} <em>{ABOUT.titleAccent}</em>
      </h2>
      <p className={styles.lead}>{ABOUT.lead}</p>
      <div className={styles.actions}>
        <LinkButton href={sectionHref("contacto")}>Cuéntanos tu idea</LinkButton>
        <LinkButton href={sectionHref("proyectos")} variant="ghost">
          Ver proyectos
        </LinkButton>
      </div>
      <ul className={styles.specialties} aria-label="Especialidades">
        {ABOUT.specialties.map((specialty) => (
          <li key={specialty}>{specialty}</li>
        ))}
      </ul>
    </Section>
  );
}
