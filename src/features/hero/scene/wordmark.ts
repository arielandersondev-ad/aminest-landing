import {
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
} from "three";

const FONT_PX = 256;
/** Capas apiladas que simulan la extrusión: el frente a color y los cantos más oscuros. */
const LAYERS = 64;
const DEPTH = 0.46;
/** Altura de la mayúscula en unidades de la escena. */
const CAP_HEIGHT = 2;

/**
 * El wordmark "AmiNest" en 3D: el texto real en Sora pintado en un canvas
 * y repetido en capas para darle volumen.
 */
export class Wordmark {
  readonly group = new Group();
  /** Ancho del texto en unidades de la escena. */
  width = 10;
  /** Punto sobre la N donde se posa la paloma. */
  readonly landing = new Vector3();
  /** Donde termina de caer la pluma, sobre el título. */
  readonly featherRest = new Vector3();

  private readonly canvas = document.createElement("canvas");
  private texture: CanvasTexture | null = null;
  private geometry: PlaneGeometry | null = null;
  private readonly layerMaterials = Array.from({ length: LAYERS }, (_, i) => {
    const shade = i === 0 ? 1 : 0.74 - (0.2 * i) / LAYERS;
    return new MeshBasicMaterial({
      alphaTest: 0.5,
      side: DoubleSide,
      color: new Color().setRGB(shade, shade, shade, SRGBColorSpace),
    });
  });

  constructor(private readonly fontFamily: string, private readonly maxAnisotropy: number) {}

  /** Vuelve a dibujar el texto (al cargar la fuente o al cambiar de tema). */
  rebuild(colors: { ami: string; nest: string }): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    const font = `600 ${FONT_PX}px ${this.fontFamily}`;
    ctx.font = font;

    const amiWidth = ctx.measureText("Ami").width;
    const fullWidth = ctx.measureText("AmiNest").width;
    const nMetrics = ctx.measureText("N");
    const stemMetrics = ctx.measureText("l");
    const capHeight = nMetrics.actualBoundingBoxAscent || FONT_PX * 0.7;
    const stem = stemMetrics.actualBoundingBoxLeft + stemMetrics.actualBoundingBoxRight || FONT_PX * 0.12;
    const pad = Math.ceil(FONT_PX * 0.12);

    this.canvas.width = Math.ceil(fullWidth + pad * 2);
    this.canvas.height = Math.ceil(FONT_PX * 1.25);
    const baseline = pad + capHeight;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.font = font;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = colors.ami;
    ctx.fillText("Ami", pad, baseline);
    ctx.fillStyle = colors.nest;
    ctx.fillText("Nest", pad + amiWidth, baseline);

    this.texture?.dispose();
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = this.maxAnisotropy;
    this.layerMaterials.forEach((material) => {
      material.map = this.texture;
      material.needsUpdate = true;
    });

    const unitsPerPx = CAP_HEIGHT / capHeight;
    this.width = fullWidth * unitsPerPx;
    this.rebuildLayers(unitsPerPx, pad, baseline);

    const nLeft = amiWidth - nMetrics.actualBoundingBoxLeft;
    this.landing.set(-this.width / 2 + (nLeft + stem / 2) * unitsPerPx, CAP_HEIGHT, -DEPTH / 2);
    this.featherRest.set(this.landing.x + 1.2, -0.4, 0.35);
  }

  dispose(): void {
    this.texture?.dispose();
    this.geometry?.dispose();
    this.layerMaterials.forEach((material) => material.dispose());
  }

  private rebuildLayers(unitsPerPx: number, pad: number, baseline: number): void {
    this.group.clear();
    this.geometry?.dispose();

    const planeWidth = this.canvas.width * unitsPerPx;
    const planeHeight = this.canvas.height * unitsPerPx;
    this.geometry = new PlaneGeometry(planeWidth, planeHeight);
    const centerX = -this.width / 2 - pad * unitsPerPx + planeWidth / 2;
    const centerY = baseline * unitsPerPx - planeHeight / 2;

    for (let i = LAYERS - 1; i >= 0; i--) {
      const layer = new Mesh(this.geometry, this.layerMaterials[i]);
      layer.position.set(centerX, centerY, (-i * DEPTH) / (LAYERS - 1));
      this.group.add(layer);
    }
  }
}
