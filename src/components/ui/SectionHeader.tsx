import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cx(styles.header, className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className={styles.eyebrow}>{children}</span>;
}
