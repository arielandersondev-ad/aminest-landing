import { createStore } from "@/lib/store";

/** Índice del panel visible; lo actualiza el navegador de paneles y lo leen navbar, pager y menú. */
export const activePanelStore = createStore(0);

export type Direction = 1 | -1;

export interface EdgeHintState {
  visible: boolean;
  direction: Direction;
  /** 0..1: cuánto falta empujar para cambiar de sección. */
  progress: number;
}

export const edgeHintStore = createStore<EdgeHintState>({ visible: false, direction: 1, progress: 0 });

const HINT_AUTO_HIDE_MS = 1600;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

export function showEdgeHint(direction: Direction, progress: number): void {
  edgeHintStore.set({ visible: true, direction, progress: Math.min(1, Math.max(0, progress)) });
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideEdgeHint, HINT_AUTO_HIDE_MS);
}

export function hideEdgeHint(): void {
  clearTimeout(hideTimer);
  edgeHintStore.set((prev) => (prev.visible ? { ...prev, visible: false, progress: 0 } : prev));
}
