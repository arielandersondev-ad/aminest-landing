import { BoxGeometry, Group, Mesh, Shape, ShapeGeometry, Vector2 } from "three";
import type { SceneMaterials } from "./materials";

/** Pluma de dos tonos con raquis, centrada en su punto medio para que gire al caer. */
export function createFeatherModel(materials: SceneMaterials): Group {
  const [, tone2, tone3] = materials.body;
  const v = (x: number, y: number) => new Vector2(x, y);

  const left = new Mesh(
    new ShapeGeometry(new Shape([v(0, 0), v(-0.06, 0.1), v(-0.085, 0.27), v(-0.055, 0.42), v(0, 0.5)])),
    tone2,
  );
  const right = new Mesh(
    new ShapeGeometry(new Shape([v(0, 0), v(0.05, 0.12), v(0.075, 0.3), v(0.045, 0.44), v(0, 0.5)])),
    tone3,
  );
  const shaft = new Mesh(new BoxGeometry(0.012, 0.62, 0.012), tone2);
  shaft.position.y = 0.22;

  const feather = new Group();
  feather.add(left, right, shaft);
  feather.children.forEach((part) => (part.position.y -= 0.25));
  feather.visible = false;
  return feather;
}
