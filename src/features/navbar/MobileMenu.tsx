"use client";

import { useEffect, useRef, type RefObject } from "react";
import { QUOTE_CTA, SECTIONS, sectionHref, type SectionId } from "@/content/sections";
import { cx } from "@/lib/cx";
import { MOBILE_MENU_ID } from "./MenuButton";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  open: boolean;
  activeId: SectionId;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onClose(): void;
}

/**
 * Lista de secciones para pantallas donde las opciones del navbar no caben.
 * Se cierra al elegir, al tocar fuera o con Escape (que devuelve el foco al botón).
 */
export function MobileMenu({ open, activeId, triggerRef, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const current = menu?.querySelector<HTMLAnchorElement>('[aria-current="location"]');
    (current ?? menu?.querySelector<HTMLAnchorElement>("a"))?.focus({ preventScroll: true });

    const controller = new AbortController();
    document.addEventListener(
      "pointerdown",
      (event) => {
        const target = event.target as Node;
        if (!menu?.contains(target) && !triggerRef.current?.contains(target)) onClose();
      },
      { signal: controller.signal },
    );
    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        onClose();
        triggerRef.current?.focus({ preventScroll: true });
      },
      { signal: controller.signal, capture: true },
    );
    return () => controller.abort();
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={menuRef}
      id={MOBILE_MENU_ID}
      className={styles.menu}
      data-open={open}
      onClick={(event) => {
        if ((event.target as Element).closest("a")) onClose();
      }}
    >
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={sectionHref(section.id)}
          aria-current={section.id === activeId ? "location" : undefined}
        >
          {section.label}
        </a>
      ))}
      <a className={cx(styles.cta)} href={sectionHref(QUOTE_CTA.target)}>
        {QUOTE_CTA.longLabel}
      </a>
    </div>
  );
}
