"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { sectionHref } from "@/content/sections";
import { SITE } from "@/content/site";
import { introStore } from "@/features/intro/introStore";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/media";
import { createHeroScene, type HeroSceneController } from "./scene/heroScene";
import styles from "./Hero.module.css";

type StageState = "playing" | "done" | "fallback";

interface HeroProps {
  /** Fondo (Illimani / ciudad); se recibe ya renderizado desde el servidor. */
  backdrop: ReactNode;
}

/** Portada: escena 3D de la paloma y el wordmark sobre el fondo difuminado. */
export function Hero({ backdrop }: HeroProps) {
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroSceneController | null>(null);
  const [state, setState] = useState<StageState>("playing");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const finish = (next: StageState) => {
      setState(next);
      introStore.set("done");
    };

    // La fuente la define next/font como variable CSS en <html>.
    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-sora").trim() || "system-ui";

    const scene = createHeroScene({
      canvas,
      stage,
      fontFamily,
      onFocusChange: setFocused,
      onPlay: () => {
        setState("playing");
        introStore.set("playing");
      },
      onFinish: () => finish("done"),
    });

    if (!scene) {
      finish("fallback");
      return;
    }
    sceneRef.current = scene;
    if (prefersReducedMotion()) scene.skip();
    else scene.play();

    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  const finished = state !== "playing";

  return (
    <header
      ref={stageRef}
      id="inicio"
      className={cx(styles.stage, (focused || finished) && styles.focused, finished && styles.done)}
    >
      <div className={styles.backdrop} aria-hidden="true">
        {backdrop}
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <h1 className="visually-hidden">
        {SITE.name}, {SITE.tagline.toLowerCase()}
      </h1>
      {state === "fallback" && (
        <div className={styles.fallback} aria-hidden="true">
          <Wordmark className={styles.fallbackWord} />
        </div>
      )}

      <a className={styles.scrollHint} href={sectionHref("nosotros")}>
        Desliza para conocernos
        <i />
      </a>

      <div className={styles.controls}>
        {state === "playing" ? (
          <button type="button" className={styles.ghost} onClick={() => sceneRef.current?.skip()}>
            Saltar intro
          </button>
        ) : (
          state === "done" && (
            <button type="button" className={styles.ghost} onClick={() => sceneRef.current?.play()}>
              Ver de nuevo
            </button>
          )
        )}
      </div>
    </header>
  );
}
