import { TimerBag } from "@/lib/timers";
import type { PigeonChoreographer } from "@/features/pigeon/PigeonChoreographer";
import { hideEdgeHint } from "./navigationStore";

export interface PanelNavigatorOptions {
  track: HTMLElement;
  panels: HTMLElement[];
  pigeon: PigeonChoreographer;
  reducedMotion: boolean;
  onActiveChange(index: number): void;
}

const BACKWARD_SLIDE = "transform .6s cubic-bezier(.6,0,.2,1)";
const FORWARD_SLIDE_EASING = "cubic-bezier(.55,0,.25,1)";
/** Tras una transición, ignora gestos un momento para que la inercia no encadene otra. */
const COOLDOWN_MS = 450;

/**
 * Mueve la pista horizontal entre paneles de pantalla completa.
 * Avanzar: la paloma vuela y, cuando cruza 2/3 de la pantalla, la sección actual sale por la izquierda.
 * Retroceder: la sección se desliza de inmediato y la paloma vuelve caminando.
 */
export class PanelNavigator {
  private index = 0;
  private busy = false;
  private cooldownUntil = 0;
  private readonly timers = new TimerBag();

  constructor(private readonly options: PanelNavigatorOptions) {
    this.place(0, null);
  }

  get activeIndex(): number {
    return this.index;
  }

  get activePanel(): HTMLElement {
    return this.options.panels[this.index];
  }

  get panelCount(): number {
    return this.options.panels.length;
  }

  isLocked(now = performance.now()): boolean {
    return this.busy || now < this.cooldownUntil;
  }

  goTo(target: number): void {
    if (this.busy || target === this.index || target < 0 || target >= this.panelCount) return;
    hideEdgeHint();
    if (target > this.index) this.forward(target);
    else this.backward(target);
  }

  step(direction: 1 | -1): void {
    this.goTo(this.index + direction);
  }

  dispose(): void {
    this.timers.clear();
  }

  private forward(target: number): void {
    this.busy = true;
    const { pigeon, reducedMotion } = this.options;

    if (reducedMotion) {
      this.place(target, null);
      pigeon.perchWithoutMotion();
      this.releaseAfter(300);
      return;
    }

    const flightMs = pigeon.flyAcross({
      onSlide: (durationMs) => this.place(target, `transform ${durationMs}ms ${FORWARD_SLIDE_EASING}`),
    });
    this.releaseAfter(flightMs + 850);
  }

  private backward(target: number): void {
    this.busy = true;
    const { pigeon, reducedMotion } = this.options;
    pigeon.cancel();
    this.place(target, BACKWARD_SLIDE);

    if (target === 0) {
      // En la portada no hay paloma posada: la escena 3D tiene la suya.
      pigeon.hide();
      this.releaseAfter(620);
      return;
    }
    if (reducedMotion) pigeon.perchWithoutMotion();
    else pigeon.walkBack();
    this.releaseAfter(650);
  }

  /** Coloca la pista en el panel `target`. `transition` null = sin animación. */
  private place(target: number, transition: string | null): void {
    const { track, panels, onActiveChange } = this.options;
    track.style.transition = transition ?? "none";
    track.style.transform = `translateX(${-target * 100}vw)`;
    // Los paneles fuera de pantalla no reciben foco ni clics.
    panels.forEach((panel, i) => {
      panel.inert = i !== target;
    });
    this.index = target;
    onActiveChange(target);
  }

  private releaseAfter(ms: number): void {
    this.timers.after(ms, () => {
      this.busy = false;
      this.cooldownUntil = performance.now() + COOLDOWN_MS;
    });
  }
}
