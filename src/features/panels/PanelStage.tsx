"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PigeonActor } from "@/features/pigeon/PigeonActor";
import { PigeonChoreographer, type PigeonElements } from "@/features/pigeon/PigeonChoreographer";
import { prefersReducedMotion } from "@/lib/media";
import { sectionIndexOf } from "@/content/sections";
import { activePanelStore } from "./navigationStore";
import { bindPanelInput } from "./panelInput";
import { PanelNavigator } from "./PanelNavigator";
import styles from "./PanelStage.module.css";

/**
 * Pista horizontal: cada hijo es un panel de pantalla completa.
 * Aquí se crean el navegador de paneles y la coreografía de la paloma, y se conectan los gestos.
 */
export function PanelStage({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const pigeonRef = useRef<PigeonElements>(null);

  useEffect(() => {
    const track = trackRef.current;
    const cover = coverRef.current;
    const pigeonElements = pigeonRef.current;
    if (!track || !cover || !pigeonElements) return;

    const panels = Array.from(track.children) as HTMLElement[];
    const pigeon = new PigeonChoreographer(pigeonElements, cover);
    const navigator = new PanelNavigator({
      track,
      panels,
      pigeon,
      reducedMotion: prefersReducedMotion(),
      initialIndex: sectionIndexOf(decodeURIComponent(window.location.hash.slice(1))),
      onActiveChange: activePanelStore.set,
    });
    const unbindInput = bindPanelInput(navigator, panels);

    return () => {
      unbindInput();
      navigator.dispose();
      pigeon.dispose();
    };
  }, []);

  return (
    <>
      <div ref={coverRef} className={styles.cover} aria-hidden="true" />
      <PigeonActor ref={pigeonRef} />
      <div className={styles.viewport}>
        <div ref={trackRef} className={styles.track}>
          {children}
        </div>
      </div>
    </>
  );
}
