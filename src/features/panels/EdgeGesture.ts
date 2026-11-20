import type { Direction } from "./navigationStore";

export type GestureOutcome =
  | { kind: "ignore" }
  | { kind: "hint"; direction: Direction; progress: number }
  | { kind: "navigate"; direction: Direction };

export interface WheelSample {
  delta: number;
  now: number;
  /** El panel ya está en el borde hacia el que se empuja. */
  atEdge: boolean;
  /** El panel tiene scroll propio (exige más fuerza que uno fijo). */
  scrollable: boolean;
  /** Hay una transición en curso o en enfriamiento. */
  locked: boolean;
}

const DEFAULTS = {
  /** Una pausa más larga que esto separa un gesto del siguiente. */
  gesturePauseMs: 260,
  thresholdScrollable: 170,
  thresholdFixed: 60,
  /** Tope por evento, para que un solo golpe fuerte de rueda no cuente como todo el empujón. */
  maxStep: 120,
};

/**
 * Resistencia en el borde.
 * El gesto que trae al usuario al final de una sección (incluida la inercia del trackpad)
 * nunca cambia de sección: hace falta un gesto nuevo, empezado ya en el borde y con algo de fuerza.
 */
export class EdgeGesture {
  private accumulated = 0;
  private lastEventAt = Number.NEGATIVE_INFINITY;
  private edgeAtGestureStart: Direction | 0 = 0;

  constructor(private readonly options = DEFAULTS) {}

  handle({ delta, now, atEdge, scrollable, locked }: WheelSample): GestureOutcome {
    const direction: Direction = delta > 0 ? 1 : -1;

    if (now - this.lastEventAt > this.options.gesturePauseMs) {
      this.accumulated = 0;
      this.edgeAtGestureStart = atEdge ? direction : 0;
    }
    this.lastEventAt = now;

    if (!atEdge) {
      this.edgeAtGestureStart = 0;
      this.accumulated = 0;
      return { kind: "ignore" };
    }
    if (locked) return { kind: "ignore" };

    // Llegó al borde a mitad de gesto: solo avisa, no cuenta.
    if (this.edgeAtGestureStart !== direction) {
      this.accumulated = 0;
      return { kind: "hint", direction, progress: 0 };
    }

    const threshold = scrollable ? this.options.thresholdScrollable : this.options.thresholdFixed;
    this.accumulated += Math.min(Math.abs(delta), this.options.maxStep);

    if (this.accumulated >= threshold) {
      this.reset();
      return { kind: "navigate", direction };
    }
    return { kind: "hint", direction, progress: this.accumulated / threshold };
  }

  reset(): void {
    this.accumulated = 0;
    this.edgeAtGestureStart = 0;
  }
}
