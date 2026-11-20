import { sectionIndexOf } from "@/content/sections";
import { EdgeGesture } from "./EdgeGesture";
import { showEdgeHint } from "./navigationStore";
import { isAtBottom, isAtTop, isScrollable } from "./panelScroll";
import type { PanelNavigator } from "./PanelNavigator";

const SWIPE_HORIZONTAL_PX = 60;
const SWIPE_VERTICAL_PX = 80;

/**
 * Conecta todas las formas de cambiar de sección con el navegador de paneles:
 * rueda/trackpad (con resistencia en el borde), gestos táctiles, teclado y enlaces "#seccion".
 * Devuelve una función que quita todos los listeners.
 */
export function bindPanelInput(navigator: PanelNavigator, panels: HTMLElement[]): () => void {
  const gesture = new EdgeGesture();
  const controller = new AbortController();
  const listen = { signal: controller.signal };
  const passive = { signal: controller.signal, passive: true };

  /* Rueda y trackpad */
  window.addEventListener(
    "wheel",
    (event) => {
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;
      const panel = navigator.activePanel;
      const outcome = gesture.handle({
        delta,
        now: performance.now(),
        atEdge: delta > 0 ? isAtBottom(panel) : isAtTop(panel),
        scrollable: isScrollable(panel),
        locked: navigator.isLocked(),
      });
      if (outcome.kind === "hint") hintTowards(navigator, outcome.direction, outcome.progress);
      if (outcome.kind === "navigate") navigator.step(outcome.direction);
    },
    passive,
  );

  /* Al llegar al borde con scroll (táctil o barra), la pista avisa qué viene */
  panels.forEach((panel) =>
    panel.addEventListener(
      "scroll",
      () => {
        if (panel !== navigator.activePanel || navigator.isLocked()) return;
        if (isAtBottom(panel)) hintTowards(navigator, 1, 0);
        else if (isAtTop(panel)) hintTowards(navigator, -1, 0);
      },
      passive,
    ),
  );

  /* Gestos táctiles: lateral siempre; vertical solo si el deslizamiento empezó ya en el borde */
  let touchStart = { x: 0, y: 0, atBottom: false, atTop: false };
  window.addEventListener(
    "touchstart",
    (event) => {
      const panel = navigator.activePanel;
      touchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        atBottom: isAtBottom(panel),
        atTop: isAtTop(panel),
      };
    },
    passive,
  );
  window.addEventListener(
    "touchend",
    (event) => {
      const panel = navigator.activePanel;
      const dx = touchStart.x - event.changedTouches[0].clientX;
      const dy = touchStart.y - event.changedTouches[0].clientY;
      if (Math.abs(dx) > SWIPE_HORIZONTAL_PX && Math.abs(dx) > Math.abs(dy)) navigator.step(dx > 0 ? 1 : -1);
      else if (dy > SWIPE_VERTICAL_PX && touchStart.atBottom && isAtBottom(panel)) navigator.step(1);
      else if (dy < -SWIPE_VERTICAL_PX && touchStart.atTop && isAtTop(panel)) navigator.step(-1);
    },
    passive,
  );

  /* Teclado: las flechas verticales siguen haciendo scroll dentro del panel */
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.target instanceof Element && event.target.closest("input, textarea, select")) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        navigator.step(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        navigator.step(-1);
      }
    },
    listen,
  );

  /* Enlaces internos (#seccion): navegan con la animación en lugar de saltar */
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link) return;
      const index = sectionIndexOf(link.getAttribute("href")!.slice(1));
      if (index < 0) return;
      event.preventDefault();
      navigator.goTo(index);
    },
    listen,
  );

  return () => controller.abort();
}

function hintTowards(navigator: PanelNavigator, direction: 1 | -1, progress: number) {
  const target = navigator.activeIndex + direction;
  if (target < 0 || target >= navigator.panelCount) return;
  showEdgeHint(direction, progress);
}
