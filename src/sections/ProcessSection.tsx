import { PigeonMark } from "@/components/brand/Pigeon";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PROCESS_STEPS } from "@/content/process";
import styles from "./ProcessSection.module.css";

/** Trazo de vuelo punteado que termina en la paloma. */
function FlightPathDecoration() {
  return (
    <svg
      viewBox="0 0 1600 320"
      preserveAspectRatio="xMidYMid meet"
      className={`decoration ${styles.path}`}
      aria-hidden="true"
    >
      <path
        d="M-20 280 C 280 120, 520 300, 820 170 S 1260 60, 1470 70"
        fill="none"
        stroke="var(--lg2)"
        strokeWidth="2.5"
        strokeDasharray="4 14"
        strokeLinecap="round"
      />
      <PigeonMark x="1450" y="10" width="110" height="110" />
    </svg>
  );
}

export function ProcessSection() {
  return (
    <Section id="proceso" decoration={<FlightPathDecoration />}>
      <SectionHeader eyebrow="Cómo trabajamos" title="Del primer café al sistema funcionando" />
      <ol className={styles.steps}>
        {PROCESS_STEPS.map((step) => (
          <li key={step.title} className={styles.step}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
