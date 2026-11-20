import { UpcomingIcon } from "@/components/icons/UpcomingIcon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UPCOMING_MODULES } from "@/content/upcoming";
import styles from "./UpcomingSection.module.css";

function BandDecorations() {
  return (
    <>
      <svg viewBox="0 0 40 120" className={`decoration ${styles.feather}`} aria-hidden="true">
        <polygon points="20,4 10,30 8,62 13,92 20,112" fill="#F6EEE3" />
        <polygon points="20,4 30,32 32,64 27,94 20,112" fill="#D9BE98" />
        <line x1="20" y1="8" x2="20" y2="118" stroke="#F6EEE3" strokeWidth="1.6" />
      </svg>
      <svg viewBox="0 0 400 400" className={`decoration ${styles.facets}`} aria-hidden="true">
        <polygon points="40,120 200,20 260,180" fill="#F6EEE3" opacity=".06" />
        <polygon points="200,20 380,140 260,180" fill="#D9BE98" opacity=".1" />
        <polygon points="40,120 260,180 120,360" fill="#A35A3A" opacity=".25" />
      </svg>
    </>
  );
}

export function UpcomingSection() {
  return (
    <Section id="proximamente" className={styles.band} decoration={<BandDecorations />}>
      <SectionHeader
        eyebrow="Próximamente"
        title="Lo que estamos construyendo"
        description="Nuevos módulos para sumar a tu sistema o usar por separado."
      />
      <div className={styles.grid}>
        {UPCOMING_MODULES.map((module) => (
          <article key={module.title} className={styles.module}>
            <span className={styles.badge}>{module.status}</span>
            <UpcomingIcon name={module.icon} className={styles.icon} />
            <h3 className={styles.title}>{module.title}</h3>
            <p className={styles.description}>{module.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
