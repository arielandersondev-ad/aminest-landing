import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES } from "@/content/services";
import styles from "./ServicesSection.module.css";

function BrowserDecoration() {
  return (
    <svg viewBox="0 0 400 300" className={`decoration ${styles.decoration}`} aria-hidden="true">
      <rect x="20" y="30" width="360" height="240" rx="18" fill="none" stroke="var(--lg1)" strokeWidth="3" />
      <line x1="20" y1="78" x2="380" y2="78" stroke="var(--lg1)" strokeWidth="3" />
      <circle cx="46" cy="54" r="7" fill="var(--lg2)" />
      <circle cx="70" cy="54" r="7" fill="var(--lg3)" />
      <polygon points="60,110 190,110 125,240" fill="var(--lg1)" />
      <polygon points="215,110 345,140 265,240" fill="var(--lg2)" />
      <polyline
        points="230,190 205,215 230,240"
        fill="none"
        stroke="var(--lg1)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServicesSection() {
  return (
    <Section id="servicios" decoration={<BrowserDecoration />}>
      <SectionHeader
        eyebrow="Servicios"
        title="Tres formas de llevar tu negocio a la web"
        description="Desde una página para que te encuentren hasta un sistema completo que organiza tu operación."
      />
      <div className={styles.grid}>
        {SERVICES.map((service) => (
          <article key={service.title} className={styles.service}>
            <ServiceIcon name={service.icon} className={styles.icon} />
            <h3 className={styles.title}>{service.title}</h3>
            <p className={styles.description}>{service.description}</p>
            <ul className={styles.highlights}>
              {service.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
