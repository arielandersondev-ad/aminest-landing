import {
  BoxGeometry,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LineSegments,
  Mesh,
  Shape,
  SphereGeometry,
  Vector2,
  type Material,
} from "three";
import type { SceneMaterials } from "./materials";

/** La paloma del logo mide 0,95 unidades; sus coordenadas vienen del lienzo de 120×120 del SVG. */
const UNIT = 0.95 / 120;
const toScene = (px: number, py: number) => new Vector2((px - 60) * UNIT, (94 - py) * UNIT);

type Outline = [number, number][];

const WING: Outline = [[72, 52], [64, 10], [52, 11], [42, 19], [34, 30], [50, 56]];
const SHOULDER = toScene(70, 54);

export interface PigeonModel {
  group: Group;
  /** Ala cercana y lejana: giran desde el hombro para aletear. */
  wing: Group;
  farWing: Group;
  /** Distancia horizontal del origen a las patas, para posarla justo sobre la N. */
  footOffsetX: number;
}

/** Paloma low-poly (variante 3B del logo) extruida en piezas planas con contorno. */
export function createPigeonModel(materials: SceneMaterials): PigeonModel {
  const [tone1, tone2, tone3, tone4] = materials.body;

  const piece = (outline: Outline, material: Material, z: number, origin?: Vector2) => {
    const shape = new Shape(
      outline.map(([x, y]) => {
        const point = toScene(x, y);
        return origin ? point.sub(origin) : point;
      }),
    );
    const geometry = new ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false });
    const mesh = new Mesh(geometry, material);
    mesh.add(new LineSegments(new EdgesGeometry(geometry), materials.outline));
    mesh.position.z = z;
    return mesh;
  };

  const group = new Group();

  const farWing = new Group();
  farWing.position.set(SHOULDER.x, SHOULDER.y, -0.05);
  farWing.add(piece(WING, tone2, 0, SHOULDER));
  farWing.scale.setScalar(0.88);
  group.add(farWing);

  group.add(piece([[48, 62], [18, 64], [22, 80], [54, 78]], tone4, 0)); // cola
  group.add(piece([[70, 54], [48, 62], [80, 86]], tone2, 0.01));
  group.add(piece([[76, 32], [88, 46], [70, 54]], tone2, 0.02));
  group.add(piece([[88, 46], [95, 62], [70, 54]], tone2, 0.025));
  group.add(piece([[70, 54], [95, 62], [82, 86]], tone3, 0.03)); // pecho
  group.add(piece([[76, 32], [86, 24], [96, 34], [88, 46]], tone1, 0.04)); // cabeza
  group.add(piece([[96, 34], [105, 39], [94, 41]], tone3, 0.04)); // pico

  const eye = new Mesh(new SphereGeometry(2.4 * UNIT, 8, 6), materials.eye);
  const eyePosition = toScene(89, 34);
  eye.position.set(eyePosition.x, eyePosition.y, 0.08);
  group.add(eye);

  for (const [legX, z] of [[74, 0], [80, 0.02]]) {
    const top = toScene(legX, 86);
    const foot = toScene(legX + 1, 94);
    const leg = new Mesh(new BoxGeometry(1.6 * UNIT, top.y - foot.y, 0.02), tone2);
    leg.position.set((top.x + foot.x) / 2, (top.y + foot.y) / 2, z + 0.015);
    group.add(leg);
  }

  const wing = new Group();
  wing.position.set(SHOULDER.x, SHOULDER.y, 0.07);
  wing.add(piece(WING, tone1, 0, SHOULDER));
  group.add(wing);

  return { group, wing, farWing, footOffsetX: toScene(77, 94).x };
}
