import { CheckIcon } from "@/components/icons/CheckIcon";
import { Section } from "@/components/ui/Section";
import { Eyebrow, SectionHeader } from "@/components/ui/SectionHeader";
import { PROJECTS, type Project, type ProjectMockup } from "@/content/projects";
import { cx } from "@/lib/cx";
import { ClinicAgendaMockup } from "./ClinicAgendaMockup";
import { DentalChartMockup } from "./DentalChartMockup";
import styles from "./ProjectsSection.module.css";

const MOCKUPS: Record<ProjectMockup, (props: { label: string }) => React.JSX.Element> = {
  "clinic-agenda": ClinicAgendaMockup,
  "dental-chart": DentalChartMockup,
};

function HealthDecorations() {
  return (
    <>
      <svg viewBox="0 0 400 300" className={`decoration ${styles.eye}`} aria-hidden="true">
        <polygon
          points="20,150 110,80 200,62 290,80 380,150 290,220 200,238 110,220"
          fill="none"
          stroke="var(--lg1)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <polygon points="200,90 252,120 252,180 200,210 148,180 148,120" fill="var(--lg2)" />
        <polygon points="200,124 226,138 226,162 200,176 174,162 174,138" fill="var(--lg1)" />
      </svg>
      <svg viewBox="0 0 300 300" className={`decoration ${styles.tooth}`} aria-hidden="true">
        <polygon
          points="60,50 115,36 150,58 185,36 240,50 252,118 228,198 212,272 184,272 166,186 150,176 134,186 116,272 88,272 72,198 48,118"
          fill="none"
          stroke="var(--lg1)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <polygon points="60,50 115,36 150,58 120,110" fill="var(--lg3)" />
      </svg>
    </>
  );
}

export function ProjectsSection() {
  return (
    <Section id="proyectos" className={styles.section} decoration={<HealthDecorations />}>
      <SectionHeader
        eyebrow="Proyectos"
        title="Sistemas que ya están trabajando"
        description="Dos proyectos para el área de salud, donde cada cita y cada historial importan."
      />
      {PROJECTS.map((project, index) => (
        <ProjectCase key={project.id} project={project} reversed={index % 2 === 1} />
      ))}
    </Section>
  );
}

function ProjectCase({ project, reversed }: { project: Project; reversed: boolean }) {
  const Mockup = MOCKUPS[project.mockup];

  return (
    <div className={cx(styles.case, reversed && styles.reversed)}>
      <div className={styles.copy}>
        <Eyebrow>{project.client}</Eyebrow>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.features}>
          {project.features.map((feature) => (
            <li key={feature}>
              <CheckIcon className={styles.check} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <Mockup label={project.mockupLabel} />
    </div>
  );
}
