/**
 * Trayectoria del vuelo de la paloma al avanzar de sección (cálculo puro, sin DOM).
 *
 * Una curva cúbica desde la percha: sube con fuerza, cruza más de media pantalla
 * y sale por la derecha creciendo hacia la cámara hasta tapar la pantalla.
 */
export interface FlightInput {
  /** Centro y ancho actuales de la paloma en pantalla. */
  actor: { centerX: number; centerY: number; width: number };
  viewport: { width: number; height: number };
  /** Si estaba posada; si no, entra volando desde abajo a la izquierda. */
  perched: boolean;
  frameCount?: number;
}

export interface FlightPlan {
  keyframes: Keyframe[];
  /** Fracción del vuelo (0..1) en la que la paloma cruza 2/3 del ancho: ahí se desliza la sección. */
  slideAt: number;
}

type Point = readonly [number, number];

/** Unidades del SVG (120×120) entre el centro del cuerpo y la punta de la cola. */
const TAIL_LENGTH = 56;
/** Escala final relativa al lado mayor de la pantalla. */
const FINAL_COVER = 2.3;
const SLIDE_THRESHOLD = 2 / 3;
const DEFAULT_SLIDE_AT = 0.62;

/** Avanza con impulso desde el inicio y acelera hacia el final, sin frenar. */
const progressAt = (u: number) => 0.55 * u + 0.45 * Math.pow(u, 2.4);

function cubicBezier(a: Point, c1: Point, c2: Point, e: Point, t: number): Point {
  const s = 1 - t;
  const at = (axis: 0 | 1) =>
    s * s * s * a[axis] + 3 * s * s * t * c1[axis] + 3 * s * t * t * c2[axis] + t * t * t * e[axis];
  return [at(0), at(1)];
}

export function planFlight({ actor, viewport, perched, frameCount = 60 }: FlightInput): FlightPlan {
  const { width: W, height: H } = viewport;
  const unit = actor.width / 120;
  const finalScale = (Math.max(W, H) / actor.width) * FINAL_COVER;
  /** Crece poco al principio y mucho al acercarse a la cámara. */
  const scaleAt = (u: number) => 1 + (finalScale - 1) * Math.pow(u, 3.4);

  const start: Point = perched ? [actor.centerX, actor.centerY] : [-0.06 * W, 0.84 * H];
  const control1: Point = [start[0] + 0.12 * W, start[1] - 0.5 * H];
  const control2: Point = [0.5 * W, 0.26 * H];
  // El punto final deja también la cola fuera del borde derecho.
  const end: Point = [W + TAIL_LENGTH * unit * finalScale + 60, 0.34 * H];

  const keyframes: Keyframe[] = [];
  let slideAt = DEFAULT_SLIDE_AT;
  let slideFound = false;
  let previous = start;

  for (let i = 0; i <= frameCount; i++) {
    const u = i / frameCount;
    const [x, y] = cubicBezier(start, control1, control2, end, progressAt(u));
    const scale = scaleAt(u);
    const heading = i === 0 ? -60 : (Math.atan2(y - previous[1], x - previous[0]) * 180) / Math.PI;
    const tilt = Math.max(-28, Math.min(8, heading * 0.35));

    if (!slideFound && x >= SLIDE_THRESHOLD * W) {
      slideAt = u;
      slideFound = true;
    }

    // El origen de la transformación es el centro del SVG; se corrige para que el cuerpo siga la curva.
    const dx = x - actor.centerX - 10 * unit * scale;
    const dy = y - actor.centerY + 2 * unit * scale;
    keyframes.push({
      transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) rotate(${tilt.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
    });
    previous = [x, y];
  }

  return { keyframes, slideAt };
}
