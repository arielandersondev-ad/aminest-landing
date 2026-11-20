import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Ancho máximo de lectura con márgenes que respetan el notch. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cx(styles.container, className)}>{children}</div>;
}
