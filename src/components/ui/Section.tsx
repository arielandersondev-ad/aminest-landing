import type { ReactNode } from "react";
import type { SectionId } from "@/content/sections";
import { cx } from "@/lib/cx";
import { Container } from "./Container";
import styles from "./Section.module.css";

interface SectionProps {
  id: SectionId;
  children: ReactNode;
  /** Ilustraciones de fondo, decorativas, detrás del contenido. */
  decoration?: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Por defecto el contenido se centra en vertical dentro del panel; las secciones largas empiezan arriba. */
  align?: "center" | "start";
}

/** Una sección de la landing; dentro de la pista horizontal ocupa un panel completo. */
export function Section({
  id,
  children,
  decoration,
  className,
  containerClassName,
  align = "center",
}: SectionProps) {
  return (
    <section id={id} className={cx(styles.section, className)} data-align={align}>
      {decoration && (
        <div className={styles.decorations} aria-hidden="true">
          {decoration}
        </div>
      )}
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
