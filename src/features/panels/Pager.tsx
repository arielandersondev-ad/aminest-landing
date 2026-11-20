"use client";

import { SECTIONS } from "@/content/sections";
import { cx } from "@/lib/cx";
import { useStore } from "@/lib/store";
import { activePanelStore } from "./navigationStore";
import styles from "./Pager.module.css";

/** Puntos de posición. Decorativos: la navegación accesible está en el navbar y el menú. */
export function Pager() {
  const active = useStore(activePanelStore, 0);

  return (
    <div className={styles.pager} aria-hidden="true">
      {SECTIONS.map((section, index) => (
        <i key={section.id} className={cx(index === active && styles.active)} />
      ))}
    </div>
  );
}
