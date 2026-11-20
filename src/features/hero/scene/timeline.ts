import { Vector3, type Group, type PerspectiveCamera } from "three";
import { easeInCubic, easeInOutCubic, easeOutCubic, lerp, progressBetween } from "./easing";
import type { PigeonModel } from "./pigeonModel";
import type { Wordmark } from "./wordmark";

/**
 * Guion de la escena de portada, en segundos:
 *  0.00–2.25  la paloma llega volando y se posa en la N (cámara cerca)
 *  2.60–5.00  la cámara se aleja y revela "AmiNest"; desde 2.9 el fondo se difumina
 *  5.90–7.80  la paloma despega y sale de cuadro
 *  6.15–9.20  cae una pluma meciéndose sobre el título
 */
export const INTRO_END = 9.4;
export const FOCUS_AT = 2.9;

export interface SceneRig {
  pigeon: PigeonModel;
  feather: Group;
  wordmark: Wordmark;
  camera: PerspectiveCamera;
  /** Distancia de cámara que encuadra todo el wordmark; depende del tamaño de la pantalla. */
  wideDistance: number;
}

const PI = Math.PI;
const cameraPosition = new Vector3();
const cameraTarget = new Vector3();
const scratchA = new Vector3();
const scratchB = new Vector3();

/** Coloca todo en la pose del instante `t`. Es determinista: el mismo `t` da siempre la misma imagen. */
export function poseAt(t: number, rig: SceneRig): void {
  posePigeon(t, rig);
  poseCamera(t, rig);
  poseFeather(t, rig);
}

function posePigeon(t: number, { pigeon, wordmark }: SceneRig): void {
  const landing = wordmark.landing;
  const perchX = landing.x - pigeon.footOffsetX;
  let x: number;
  let y: number;
  let pitch = 0;
  let wingZ: number;
  let wingX = 0;

  if (t < 2.25) {
    // Llega planeando desde la izquierda y frena antes de posarse.
    const k = easeOutCubic(progressBetween(t, 0, 2.25));
    x = perchX - 2.6 * (1 - k);
    y = landing.y + 1.5 * (1 - k) * (1 - k) + 0.12 * Math.sin(k * PI);
    if (t < 1.7) {
      const flap = Math.sin(t * 19);
      wingZ = 0.25 + 0.6 * flap;
      wingX = 0.35 * flap;
      pitch = -0.12;
    } else {
      wingZ = lerp(0.1, 1.25, progressBetween(t, 1.95, 2.45));
      pitch = lerp(0.32, 0, progressBetween(t, 2.1, 2.5));
    }
  } else if (t < 5.9) {
    // Posada, respirando.
    x = perchX;
    y = landing.y;
    wingZ = 1.25;
    pitch = 0.025 * Math.sin((t - 2.25) * 3.2);
  } else {
    // Despega hacia arriba a la derecha.
    const k = easeInCubic(progressBetween(t, 5.9, 7.8));
    const takeOff = progressBetween(t, 5.9, 6.1);
    const flap = Math.sin((t - 5.9) * 20);
    x = perchX + 6.5 * k;
    y = landing.y + 5.2 * k + 0.15 * takeOff;
    wingZ = lerp(1.25, 0.25 + 0.6 * flap, takeOff);
    wingX = 0.35 * flap * takeOff;
    pitch = -0.3 * progressBetween(t, 5.9, 6.3);
  }

  pigeon.group.position.set(x, y, landing.z);
  pigeon.group.rotation.z = pitch;
  pigeon.wing.rotation.z = wingZ;
  pigeon.wing.rotation.x = wingX;
  pigeon.farWing.rotation.z = wingZ * 0.9 + 0.08;
  pigeon.farWing.rotation.x = -wingX;
  pigeon.group.visible = t < 7.8;
}

function poseCamera(t: number, { camera, wordmark, wideDistance }: SceneRig): void {
  const landing = wordmark.landing;
  const k = easeInOutCubic(progressBetween(t, 2.6, 5.0));
  cameraPosition.lerpVectors(
    scratchA.set(landing.x + 0.25, landing.y + 0.85, 3.1),
    scratchB.set(0, 1.05, wideDistance),
    k,
  );
  cameraTarget.lerpVectors(scratchA.set(landing.x + 0.05, landing.y + 0.3, 0), scratchB.set(0, 1.0, 0), k);
  camera.position.copy(cameraPosition);
  camera.lookAt(cameraTarget);
}

function poseFeather(t: number, { feather, wordmark }: SceneRig): void {
  if (t < 6.15) {
    feather.visible = false;
    return;
  }
  const { landing, featherRest } = wordmark;
  const startX = landing.x + 0.2;
  const startY = landing.y + 0.45;
  const startZ = 0.25;

  const q = progressBetween(t, 6.15, 9.2);
  const fall = 1 - Math.pow(1 - q, 1.6);
  const sway = 1 - q;

  feather.visible = true;
  feather.position.set(
    lerp(startX, featherRest.x, fall) + 0.45 * Math.sin(q * PI * 3.2) * sway,
    lerp(startY, featherRest.y, fall),
    lerp(startZ, featherRest.z, q),
  );
  feather.rotation.set(
    0.35 * Math.sin(q * PI * 2.4) * sway,
    0,
    lerp(0.3, -1.42, easeInOutCubic(q)) + 0.7 * Math.sin(q * PI * 3.2) * sway,
  );
}
