"use client";

import { useEffect, useRef, useState } from "react";
import { activePanelStore } from "@/features/panels/navigationStore";
import { prefersReducedMotion } from "@/lib/media";
import styles from "./FeatherDrops.module.css";

interface Drop {
  id: number;
  leftVw: number;
  sway: 1 | -1;
}

const FALL_MS = 4600;

/** Cada vez que cambias de sección cae una pluma meciéndose. */
export function FeatherDrops() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let previous = activePanelStore.get();
    return activePanelStore.subscribe(() => {
      const current = activePanelStore.get();
      if (current === previous) return;
      previous = current;
      const drop: Drop = {
        id: nextId.current++,
        leftVw: 12 + Math.random() * 76,
        sway: Math.random() < 0.5 ? -1 : 1,
      };
      setDrops((list) => [...list, drop]);
    });
  }, []);

  const remove = (id: number) => setDrops((list) => list.filter((drop) => drop.id !== id));

  return drops.map((drop) => <Feather key={drop.id} drop={drop} onDone={() => remove(drop.id)} />);
}

function Feather({ drop, onDone }: { drop: Drop; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const s = drop.sway;
    const fall = window.innerHeight;
    const animation = element.animate(
      [
        { transform: `translate(0,0) rotate(${-25 * s}deg)`, opacity: 0 },
        { transform: `translate(${40 * s}px,${fall * 0.25}px) rotate(${30 * s}deg)`, opacity: 1, offset: 0.22 },
        { transform: `translate(${-35 * s}px,${fall * 0.55}px) rotate(${-22 * s}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${25 * s}px,${fall * 0.85}px) rotate(${15 * s}deg)`, opacity: 0.9, offset: 0.85 },
        { transform: `translate(${10 * s}px,${fall + 140}px) rotate(${60 * s}deg)`, opacity: 0 },
      ],
      { duration: FALL_MS, easing: "cubic-bezier(.35,.1,.55,.95)" },
    );
    animation.onfinish = () => onDoneRef.current();
    return () => animation.cancel();
  }, [drop]);

  return (
    <div ref={ref} className={styles.feather} style={{ left: `${drop.leftVw}vw` }} aria-hidden="true">
      <svg viewBox="0 0 40 120">
        <polygon points="20,4 10,30 8,62 13,92 20,112" fill="var(--bd2)" />
        <polygon points="20,4 30,32 32,64 27,94 20,112" fill="var(--bd3)" />
        <line x1="20" y1="8" x2="20" y2="118" stroke="var(--bd2)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}
