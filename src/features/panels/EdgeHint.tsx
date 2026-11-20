"use client";

import { SECTIONS } from "@/content/sections";
import { cx } from "@/lib/cx";
import { useStore } from "@/lib/store";
import { activePanelStore, edgeHintStore } from "./navigationStore";
import styles from "./EdgeHint.module.css";

/** Pista en el borde: avisa a dónde lleva el siguiente empujón y se llena mientras empujas. */
export function EdgeHint() {
  const { visible, direction, progress } = useStore(edgeHintStore);
  const active = useStore(activePanelStore, 0);
  const target = SECTIONS[active + direction];

  const text = target
    ? direction > 0
      ? `Sigue para ver ${target.label} →`
      : `← Vuelve a ${target.label}`
    : "";

  return (
    <div
      className={cx("glass", styles.hint, direction < 0 && styles.up, visible && target && styles.visible)}
      aria-hidden="true"
    >
      <span>{text}</span>
      <i className={styles.bar}>
        <b style={{ transform: `scaleX(${progress})` }} />
      </i>
    </div>
  );
}
