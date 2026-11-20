import type { ReactNode } from "react";
import styles from "./Mockups.module.css";

interface MockupWindowProps {
  title: string;
  label: string;
  children: ReactNode;
}

/** Marco de ventana para las maquetas; se anuncia como una sola imagen a los lectores de pantalla. */
export function MockupWindow({ title, label, children }: MockupWindowProps) {
  return (
    <div className={styles.window} role="img" aria-label={label}>
      <div className={styles.titleBar}>
        <i />
        <i />
        <i />
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
