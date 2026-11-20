"use client";

import { ThemeIcon } from "@/components/icons/ThemeIcon";
import { cx } from "@/lib/cx";
import { nextThemePreference, setThemePreference, useThemePreference } from "./theme";
import { THEME_LABELS } from "./themeConfig";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
}

/** Un clic recorre Sistema → Claro → Oscuro. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const preference = useThemePreference();
  const label = THEME_LABELS[preference];

  return (
    <button
      type="button"
      className={cx(styles.toggle, className)}
      aria-label={`Tema: ${label}. Cambiar tema`}
      title={`Tema: ${label}`}
      onClick={() => setThemePreference(nextThemePreference(preference))}
    >
      <ThemeIcon preference={preference} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </button>
  );
}
