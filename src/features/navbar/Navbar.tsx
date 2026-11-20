"use client";

import { useCallback, useRef, useState } from "react";
import { EmblemA } from "@/components/brand/EmblemA";
import { QUOTE_CTA, SECTIONS, sectionHref, type SiteSection } from "@/content/sections";
import { activePanelStore } from "@/features/panels/navigationStore";
import { introStore } from "@/features/intro/introStore";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { cx } from "@/lib/cx";
import { useMediaQuery } from "@/lib/media";
import { useStore } from "@/lib/store";
import { MenuButton } from "./MenuButton";
import { MobileMenu } from "./MobileMenu";
import styles from "./Navbar.module.css";

/** Ancho a partir del cual las opciones ya no caben en el navbar y pasan al menú. */
export const COMPACT_NAV_QUERY = "(max-width: 960px)";

const LEFT_LINKS = SECTIONS.filter((section) => section.navSide === "left");
const RIGHT_LINKS = SECTIONS.filter((section) => section.navSide === "right");

/**
 * Navbar flotante: botón de menú · barra partida de vidrio con la A al centro · selector de tema.
 * La opción de la sección visible queda marcada; sobre la banda vino el vidrio se vuelve más opaco.
 */
export function Navbar() {
  const activeIndex = useStore(activePanelStore, 0);
  const introPlaying = useStore(introStore, "playing") === "playing";
  const isCompact = useMediaQuery(COMPACT_NAV_QUERY);
  const [menuRequested, setMenuRequested] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuRequested(false), []);

  const activeSection = SECTIONS[activeIndex];
  const menuOpen = menuRequested && isCompact;

  return (
    <>
      <nav
        className={cx(styles.nav, introPlaying && styles.hidden)}
        data-tone={activeSection.tone}
        aria-label="Principal"
      >
        <MenuButton
          ref={menuButtonRef}
          className={cx(styles.pill, "glass")}
          enabled={isCompact}
          open={menuOpen}
          onToggle={() => setMenuRequested((open) => !open)}
        />

        <div className={styles.bar}>
          <div className={cx("glass", styles.half, styles.halfLeft)}>
            {LEFT_LINKS.map((section) => (
              <NavLink key={section.id} section={section} active={section === activeSection} />
            ))}
          </div>

          <a className={styles.emblem} href={sectionHref("inicio")} aria-label="AmiNest, volver al inicio">
            <EmblemA />
          </a>

          <div className={cx("glass", styles.half, styles.halfRight)}>
            {RIGHT_LINKS.map((section) => (
              <NavLink key={section.id} section={section} active={section === activeSection} />
            ))}
            <a className={cx(styles.link, styles.cta)} href={sectionHref(QUOTE_CTA.target)}>
              {QUOTE_CTA.label}
            </a>
          </div>
        </div>

        <ThemeToggle className={cx(styles.pill, "glass")} />
      </nav>

      <MobileMenu
        open={menuOpen}
        activeId={activeSection.id}
        triggerRef={menuButtonRef}
        onClose={closeMenu}
      />
    </>
  );
}

function NavLink({ section, active }: { section: SiteSection; active: boolean }) {
  return (
    <a className={styles.link} href={sectionHref(section.id)} aria-current={active ? "location" : undefined}>
      {section.label}
    </a>
  );
}
