/** Progreso 0..1 de `t` dentro del tramo [start, end]. */
export const progressBetween = (t: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (t - start) / (end - start)));

export const lerp = (from: number, to: number, k: number) => from + (to - from) * k;

export const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);
export const easeInCubic = (k: number) => k * k * k;
export const easeInOutCubic = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
