import { TimerBag } from "@/lib/timers";
import { planFlight } from "./flightPath";

export interface PigeonElements {
  /** Contenedor fijo abajo a la izquierda. */
  root: HTMLElement;
  svg: SVGSVGElement;
  body: SVGGElement;
  wing: SVGGElement;
  legs: SVGGElement;
}

export interface FlightCallbacks {
  /** La paloma cruzó 2/3 de la pantalla: es el momento de deslizar la sección durante `durationMs`. */
  onSlide(durationMs: number): void;
}

/* Poses del ala (el origen de giro es el hombro) */
const WING_FOLDED = "rotate(-72deg) scale(.82)";
const WING_HALF_OPEN = "rotate(-48deg) scale(.92)";
const WING_UP = "rotate(0deg) scaleY(1)";
const WING_DOWN = "rotate(10deg) scaleY(-.6)";
/** Gira la paloma en 3D para que mire a la izquierda (no es un espejo plano). */
const FACING_BACK = "perspective(520px) rotateY(180deg)";

const TIMING = {
  crouchMs: 260,
  flightMs: 1500,
  minSlideMs: 480,
  slideOverlapMs: 120,
  landMs: 700,
  turnMs: 560,
  walkStepMs: 340,
};

/**
 * Coreografía de la paloma que acompaña los cambios de sección.
 * Avanzar: se prepara, despega y vuela hacia la cámara tapando la pantalla; luego se posa.
 * Retroceder: vuelve caminando y se da la vuelta en su sitio.
 */
export class PigeonChoreographer {
  private readonly timers = new TimerBag();

  constructor(
    private readonly pigeon: PigeonElements,
    private readonly cover: HTMLElement,
  ) {}

  get isPerched(): boolean {
    return this.pigeon.root.dataset.visible === "true";
  }

  show(): void {
    this.pigeon.root.dataset.visible = "true";
  }

  hide(): void {
    this.pigeon.root.dataset.visible = "false";
    this.pigeon.svg.style.transform = "";
  }

  /** Detiene cualquier animación en curso y deja la paloma en su pose de reposo. */
  cancel(): void {
    this.timers.clear();
    const { root, svg, body, wing, legs } = this.pigeon;
    [root, svg, body, wing, legs, this.cover].forEach((el) =>
      el.getAnimations().forEach((animation) => animation.cancel()),
    );
    svg.style.transform = "";
  }

  dispose(): void {
    this.cancel();
  }

  /** Vuela hacia la cámara cruzando la pantalla. Devuelve cuánto dura hasta posarse en el panel nuevo. */
  flyAcross({ onSlide }: FlightCallbacks): number {
    this.cancel();
    const { root, body, wing, legs } = this.pigeon;
    const perched = this.isPerched;
    this.show();

    const rect = root.getBoundingClientRect();
    const plan = planFlight({
      actor: { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.width / 2, width: rect.width },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      perched,
    });

    const D = TIMING.flightMs;
    let takeOffAt = 0;
    if (perched) {
      // Parada → se prepara: se agacha y abre un poco el ala.
      body.animate([{ transform: "none" }, { transform: "translateY(5px) scaleY(.86) rotate(9deg)" }], {
        duration: TIMING.crouchMs,
        easing: "ease-in",
        fill: "forwards",
      });
      wing.animate([{ transform: WING_FOLDED }, { transform: WING_HALF_OPEN }], {
        duration: TIMING.crouchMs,
        fill: "forwards",
      });
      takeOffAt = TIMING.crouchMs;
    } else {
      legs.animate([{ opacity: 0 }], { duration: 1, fill: "forwards" });
    }

    const slideStart = plan.slideAt * D;
    const slideDuration = Math.max(TIMING.minSlideMs, D - slideStart + TIMING.slideOverlapMs);

    this.timers.after(takeOffAt, () => {
      this.takeOff(perched, D);
      root.animate(plan.keyframes, { duration: D, easing: "linear", fill: "forwards" });
      this.dimScreen(plan.slideAt, D);
      // Al cruzar 2/3 del ancho la sección se desliza, y termina junto con el vuelo.
      this.timers.after(slideStart, () => onSlide(slideDuration));
      this.timers.after(Math.max(D, slideStart + slideDuration) + 40, () => this.landIn());
    });

    return takeOffAt + D;
  }

  /** Vuelve caminando desde la derecha y se da la vuelta al llegar. */
  walkBack(): void {
    this.cancel();
    const { root, svg, body, legs } = this.pigeon;
    this.show();

    const distance = Math.max(240, window.innerWidth - 200);
    svg.style.transform = FACING_BACK;
    const walk = root.animate(
      [
        { transform: `translateX(${distance}px)` },
        { transform: `translateX(${(distance * 0.12).toFixed(0)}px)`, offset: 0.82 },
        { transform: "none" },
      ],
      { duration: Math.min(1800, 700 + distance * 0.8), easing: "cubic-bezier(.2,0,.35,1)" },
    );
    body.animate([{ transform: "none" }, { transform: "translateY(-3px) rotate(-5deg)" }, { transform: "none" }], {
      duration: TIMING.walkStepMs,
      iterations: Infinity,
    });
    legs.animate([{ transform: "none" }, { transform: "translateX(-2px)" }, { transform: "none" }], {
      duration: TIMING.walkStepMs,
      iterations: Infinity,
    });
    walk.onfinish = () => this.turnAround();
  }

  /** Sin animaciones (movimiento reducido): la paloma simplemente está posada. */
  perchWithoutMotion(): void {
    this.cancel();
    this.show();
  }

  private takeOff(perched: boolean, flightMs: number): void {
    const { body, wing, legs } = this.pigeon;
    body.getAnimations().forEach((a) => a.cancel());
    wing.getAnimations().forEach((a) => a.cancel());

    if (perched) {
      body.animate(
        [
          { transform: "translateY(5px) scaleY(.86) rotate(9deg)" },
          { transform: "translateY(-3px) scaleY(1.05) rotate(-8deg)" },
          { transform: "none" },
        ],
        { duration: 280, easing: "ease-out" },
      );
      legs.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" });
    }

    const openWing = wing.animate([{ transform: perched ? WING_HALF_OPEN : "rotate(0deg)" }, { transform: WING_UP }], {
      duration: 90,
    });
    // Aleteo: rápido al despegar, más amplio y lento al planear cerca de la cámara.
    openWing.onfinish = () =>
      wing.animate(
        [
          { transform: WING_UP },
          { transform: WING_DOWN },
          { transform: WING_UP },
          { transform: WING_DOWN },
          { transform: WING_UP },
          { transform: WING_DOWN },
          { transform: WING_UP },
          { transform: "rotate(6deg) scaleY(-.3)" },
          { transform: WING_UP },
          { transform: "rotate(4deg) scaleY(.2)" },
          { transform: WING_UP },
        ],
        { duration: flightMs - 90, easing: "ease-in-out" },
      );
  }

  /** Oscurece un poco la pantalla justo cuando la paloma la tapa. */
  private dimScreen(slideAt: number, flightMs: number): void {
    this.cover.animate(
      [
        { opacity: 0 },
        { opacity: 0, offset: Math.min(0.9, slideAt + 0.08) },
        { opacity: 0.2, offset: Math.min(0.95, slideAt + 0.2) },
        { opacity: 0 },
      ],
      { duration: flightMs },
    );
  }

  /** Una paloma pequeña baja planeando y se posa abajo a la izquierda. */
  private landIn(): void {
    this.cancel();
    const { root, body, wing, legs } = this.pigeon;
    this.show();
    root.animate(
      [
        { transform: "translate(-24vw,-55vh) rotate(10deg) scale(.7)", opacity: 0 },
        { transform: "translate(-8vw,-22vh) rotate(6deg) scale(.9)", opacity: 1, offset: 0.45 },
        { transform: "translate(0,-16px) rotate(-6deg) scale(1)", offset: 0.82 },
        { transform: "none" },
      ],
      { duration: TIMING.landMs, easing: "cubic-bezier(.25,.7,.3,1)" },
    );
    wing.animate(
      [
        { transform: WING_UP },
        { transform: WING_DOWN },
        { transform: WING_UP },
        { transform: WING_DOWN },
        { transform: WING_UP, offset: 0.8 },
        { transform: WING_FOLDED },
      ],
      { duration: 740 },
    );
    legs.animate([{ opacity: 0 }, { opacity: 0, offset: 0.6 }, { opacity: 1 }], { duration: TIMING.landMs });
    body.animate(
      [{ transform: "none" }, { transform: "none", offset: 0.82 }, { transform: "translateY(3px) scaleY(.93)" }, { transform: "none" }],
      { duration: 820 },
    );
  }

  /** Se agacha, da un saltito girando sobre su eje con el ala algo abierta, y aterriza. */
  private turnAround(): void {
    const { svg, body, wing, legs } = this.pigeon;
    body.getAnimations().forEach((a) => a.cancel());
    legs.getAnimations().forEach((a) => a.cancel());
    const duration = TIMING.turnMs;

    svg.style.transform = "";
    svg.animate(
      [
        { transform: FACING_BACK },
        { transform: FACING_BACK, offset: 0.18 },
        { transform: "perspective(520px) translateY(-9px) rotateY(95deg) rotateZ(-4deg)", offset: 0.52, easing: "ease-out" },
        { transform: "perspective(520px) translateY(-3px) rotateY(20deg)", offset: 0.78 },
        { transform: "perspective(520px) rotateY(0deg)" },
      ],
      { duration, easing: "ease-in-out" },
    );
    body.animate(
      [
        { transform: "none" },
        { transform: "translateY(4px) scaleY(.9) rotate(4deg)", offset: 0.18 },
        { transform: "translateY(-2px) scaleY(1.05) rotate(-3deg)", offset: 0.5 },
        { transform: "translateY(3px) scaleY(.93)", offset: 0.84 },
        { transform: "none" },
      ],
      { duration, easing: "ease-in-out" },
    );
    wing.animate(
      [
        { transform: WING_FOLDED },
        { transform: WING_FOLDED, offset: 0.2 },
        { transform: "rotate(-46deg) scale(.92)", offset: 0.5 },
        { transform: WING_FOLDED, offset: 0.85 },
        { transform: WING_FOLDED },
      ],
      { duration },
    );
    legs.animate(
      [
        { transform: "none" },
        { transform: "none", offset: 0.3 },
        { transform: "translateY(-3px)", offset: 0.5 },
        { transform: "none", offset: 0.8 },
        { transform: "none" },
      ],
      { duration },
    );
  }
}
