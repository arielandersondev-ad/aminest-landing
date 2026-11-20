import {
  DirectionalLight,
  HemisphereLight,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  type BufferGeometry,
} from "three";
import { createFeatherModel } from "./featherModel";
import { readScenePalette, SceneMaterials } from "./materials";
import { createPigeonModel } from "./pigeonModel";
import { FOCUS_AT, INTRO_END, poseAt, type SceneRig } from "./timeline";
import { Wordmark } from "./wordmark";

export interface HeroSceneOptions {
  canvas: HTMLCanvasElement;
  /** Contenedor de la escena: se observa su tamaño y si está a la vista. */
  stage: HTMLElement;
  fontFamily: string;
  /** El fondo se difumina cuando la cámara empieza a alejarse. */
  onFocusChange(focused: boolean): void;
  onPlay(): void;
  onFinish(): void;
}

export interface HeroSceneController {
  play(): void;
  skip(): void;
  dispose(): void;
}

const FIELD_OF_VIEW = 35;
/** Margen a los lados del wordmark cuando la cámara está lejos. */
const WIDE_FRAMING = 1.3;
const MIN_FRAME_HEIGHT = 4.2;
/** La interfaz (botones, enlace) aparece un poco antes del final. */
const UI_LEAD_SECONDS = 0.3;

/**
 * Escena de portada: la paloma aterriza en la N, la cámara se aleja revelando "AmiNest",
 * la paloma despega y deja caer una pluma. Devuelve null si el navegador no tiene WebGL.
 */
export function createHeroScene(options: HeroSceneOptions): HeroSceneController | null {
  const { canvas, stage, fontFamily, onFocusChange, onPlay, onFinish } = options;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(FIELD_OF_VIEW, 1, 0.05, 200);
  // Desde three r155 la luz ya no se multiplica por π: se compensa para conservar el aspecto original.
  scene.add(new HemisphereLight(0xffffff, 0xd9be98, 0.95 * Math.PI));
  const sun = new DirectionalLight(0xffffff, 0.75 * Math.PI);
  sun.position.set(-4, 7, 9);
  scene.add(sun);

  const materials = new SceneMaterials();
  const wordmark = new Wordmark(fontFamily, renderer.capabilities.getMaxAnisotropy());
  const pigeon = createPigeonModel(materials);
  const feather = createFeatherModel(materials);
  scene.add(wordmark.group, pigeon.group, feather);

  const rig: SceneRig = { pigeon, feather, wordmark, camera, wideDistance: 16 };

  let running = false;
  let finished = false;
  let focused = false;
  let visible = true;
  let startedAt = 0;
  let frame = 0;

  function repaint() {
    const palette = readScenePalette();
    materials.apply(palette);
    wordmark.rebuild({ ami: palette.ami, nest: palette.nest });
    fitCamera();
    if (!running) draw(INTRO_END);
  }

  function fitCamera() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    const aspect = width / height;
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const halfFov = Math.tan((camera.fov * Math.PI) / 360);
    rig.wideDistance = Math.max(
      (wordmark.width * WIDE_FRAMING) / 2 / (halfFov * aspect),
      MIN_FRAME_HEIGHT / 2 / halfFov,
    );
  }

  function draw(t: number) {
    poseAt(t, rig);
    const wantFocus = t >= FOCUS_AT;
    if (wantFocus !== focused) {
      focused = wantFocus;
      onFocusChange(focused);
    }
    renderer.render(scene, camera);
  }

  function finish() {
    if (finished) return;
    finished = true;
    onFinish();
  }

  function loop(now: number) {
    if (!running) return;
    const t = (now - startedAt) / 1000;
    if (visible) draw(Math.min(t, INTRO_END));
    if (t >= INTRO_END - UI_LEAD_SECONDS) finish();
    if (t >= INTRO_END) {
      running = false;
      draw(INTRO_END);
      return;
    }
    frame = requestAnimationFrame(loop);
  }

  /* Observadores: tamaño, visibilidad (no dibuja si la portada está fuera de pantalla) y tema */
  const resizeObserver = new ResizeObserver(() => {
    fitCamera();
    if (!running) draw(INTRO_END);
  });
  resizeObserver.observe(stage);

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibilityObserver.observe(stage);

  const themeObserver = new MutationObserver(repaint);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  colorScheme.addEventListener("change", repaint);

  // La fuente llega después del primer dibujo: se vuelve a componer el texto cuando está lista.
  document.fonts?.load(`600 256px ${fontFamily}`).then(repaint, () => undefined);

  repaint();

  return {
    play() {
      cancelAnimationFrame(frame);
      finished = false;
      focused = false;
      onFocusChange(false);
      onPlay();
      startedAt = performance.now();
      running = true;
      frame = requestAnimationFrame(loop);
    },
    skip() {
      running = false;
      cancelAnimationFrame(frame);
      draw(INTRO_END);
      finish();
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      colorScheme.removeEventListener("change", repaint);
      scene.traverse((object) => {
        if (object instanceof Mesh || object instanceof LineSegments) (object.geometry as BufferGeometry).dispose();
      });
      wordmark.dispose();
      materials.dispose();
      renderer.dispose();
    },
  };
}
