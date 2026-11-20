import type { SVGProps } from "react";

/**
 * Paloma low-poly de AmiNest (variante 3B: ala levantada, pecho contenido).
 * Coordenadas en un lienzo de 120×120; los colores vienen de los tokens --bd*.
 */
export const PIGEON_WING_POINTS = "72,52 64,10 52,11 42,19 34,30 50,56";

export function PigeonShapes() {
  return (
    <>
      <polygon points="48,62 18,64 22,80 54,78" fill="var(--bd4)" />
      <polygon points="70,54 48,62 80,86" fill="var(--bd2)" opacity=".6" />
      <polygon points="76,32 88,46 70,54" fill="var(--bd2)" />
      <polygon points="88,46 95,62 70,54" fill="var(--bd2)" opacity=".75" />
      <polygon points="70,54 95,62 82,86" fill="var(--bd3)" />
      <polygon points={PIGEON_WING_POINTS} fill="var(--bd1)" opacity=".92" />
      <polygon points="76,32 86,24 96,34 88,46" fill="var(--bd1)" />
      <polygon points="96,34 105,39 94,41" fill="var(--bd3)" />
      <circle cx="89" cy="34" r="2.3" fill="var(--bdon)" />
    </>
  );
}

/** La paloma como imagen independiente. Acepta x/y/width/height para anidarla en otro SVG. */
export function PigeonMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <PigeonShapes />
    </svg>
  );
}
