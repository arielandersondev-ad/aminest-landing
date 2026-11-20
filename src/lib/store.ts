import { useSyncExternalStore } from "react";

/**
 * Store mínimo para compartir estado entre código imperativo (animaciones, escena 3D)
 * y componentes de React sin Providers ni dependencias externas.
 */
export interface Store<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(listener: () => void): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => state,
    set(next) {
      const value = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      if (Object.is(value, state)) return;
      state = value;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** Lee un store desde React. `serverValue` es lo que se renderiza en el servidor y al hidratar. */
export function useStore<T>(store: Store<T>, serverValue: T = store.get()): T {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}
