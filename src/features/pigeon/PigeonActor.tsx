"use client";

import { useImperativeHandle, useRef, type Ref } from "react";
import { PIGEON_WING_POINTS } from "@/components/brand/Pigeon";
import type { PigeonElements } from "./PigeonChoreographer";
import styles from "./PigeonActor.module.css";

interface PigeonActorProps {
  ref: Ref<PigeonElements | null>;
}

/** La paloma "actriz" que acompaña los cambios de sección. Cuerpo, ala y patas se animan por separado. */
export function PigeonActor({ ref }: PigeonActorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const wingRef = useRef<SVGGElement>(null);
  const legsRef = useRef<SVGGElement>(null);

  useImperativeHandle(ref, () => ({
    root: rootRef.current!,
    svg: svgRef.current!,
    body: bodyRef.current!,
    wing: wingRef.current!,
    legs: legsRef.current!,
  }));

  return (
    <div ref={rootRef} className={styles.actor} data-visible="false" aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 120 120">
        <g ref={bodyRef} className={styles.body}>
          <g ref={legsRef} className={styles.legs} stroke="var(--bd2)" strokeWidth="2.6" strokeLinecap="round">
            <line x1="74" y1="84" x2="72" y2="96" />
            <line x1="80" y1="84" x2="81" y2="96" />
          </g>
          <polygon points="48,62 18,64 22,80 54,78" fill="var(--bd4)" />
          <polygon points="70,54 48,62 80,86" fill="var(--bd2)" opacity=".7" />
          <polygon points="76,32 88,46 70,54" fill="var(--bd2)" />
          <polygon points="88,46 95,62 70,54" fill="var(--bd2)" opacity=".8" />
          <polygon points="70,54 95,62 82,86" fill="var(--bd3)" />
          <polygon points="76,32 86,24 96,34 88,46" fill="var(--bd1)" />
          <polygon points="96,34 105,39 94,41" fill="var(--bd3)" />
          <circle cx="89" cy="34" r="2.3" fill="var(--bdon)" />
          <g ref={wingRef} className={styles.wing}>
            <polygon points={PIGEON_WING_POINTS} fill="var(--bd1)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
