import type { Ref } from "react";
import { cx } from "@/lib/cx";
import styles from "./Navbar.module.css";

interface MenuButtonProps {
  ref: Ref<HTMLButtonElement>;
  className?: string;
  /** Solo funciona en pantallas angostas; en escritorio es un botón decorativo, por ahora sin función. */
  enabled: boolean;
  open: boolean;
  onToggle(): void;
}

export const MOBILE_MENU_ID = "mobile-menu";

export function MenuButton({ ref, className, enabled, open, onToggle }: MenuButtonProps) {
  const label = enabled ? (open ? "Cerrar menú" : "Abrir menú") : "Menú (próximamente)";

  return (
    <button
      ref={ref}
      type="button"
      className={cx(className, styles.menuButton)}
      aria-label={label}
      title={enabled ? undefined : "Próximamente"}
      aria-controls={MOBILE_MENU_ID}
      aria-expanded={open}
      onClick={() => enabled && onToggle()}
    >
      <svg className={styles.pulseIcon} viewBox="0 0 24 24" aria-hidden="true">
        <polyline
          points="2,13 7,13 9.5,8 12.5,17 15,11 17,13 22,13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg className={styles.menuIcon} viewBox="0 0 24 24" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <line className={styles.lineTop} x1="5" y1="8" x2="19" y2="8" />
          <line className={styles.lineBottom} x1="5" y1="16" x2="19" y2="16" />
        </g>
      </svg>
    </button>
  );
}
