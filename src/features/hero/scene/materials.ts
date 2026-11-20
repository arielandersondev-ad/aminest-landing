import { DoubleSide, LineBasicMaterial, MeshStandardMaterial } from "three";
import { resolveCssColor } from "@/lib/cssColor";

/** Colores de la escena leídos de los tokens del tema activo. */
export interface ScenePalette {
  ami: string;
  nest: string;
  body: [string, string, string, string];
  eye: string;
  outline: string;
}

export function readScenePalette(): ScenePalette {
  return {
    ami: resolveCssColor("--accent"),
    nest: resolveCssColor("--lg4"),
    body: [resolveCssColor("--bd1"), resolveCssColor("--bd2"), resolveCssColor("--bd3"), resolveCssColor("--bd4")],
    eye: resolveCssColor("--bdon"),
    outline: resolveCssColor("--bdline"),
  };
}

const facet = () =>
  new MeshStandardMaterial({ flatShading: true, roughness: 0.8, metalness: 0, side: DoubleSide });

/** Materiales low-poly de la paloma y la pluma; se repintan al cambiar el tema. */
export class SceneMaterials {
  readonly body = [facet(), facet(), facet(), facet()] as const;
  readonly eye = facet();
  readonly outline = new LineBasicMaterial({ transparent: true, opacity: 0.6 });

  apply(palette: ScenePalette): void {
    this.body.forEach((material, i) => material.color.set(palette.body[i]));
    this.eye.color.set(palette.eye);
    this.outline.color.set(palette.outline);
  }

  dispose(): void {
    [...this.body, this.eye, this.outline].forEach((material) => material.dispose());
  }
}
