/**
 * Genera la ciudad de noche (laderas con casas iluminadas y edificios con ventanas encendidas).
 * Usa un generador con semilla fija: el resultado es siempre el mismo, en el servidor y en el cliente.
 */
export interface Star { cx: number; cy: number; r: number; opacity: number }
export interface Light { x: number; y: number; warm: boolean; opacity: number }
export interface Building { x: number; y: number; width: number; height: number; fill: string }
export interface Antenna { x: number; y: number; fill: string }
export interface LitWindow { x: number; y: number; opacity: number }

export interface NightCity {
  stars: Star[];
  hillsideLights: Light[];
  buildings: Building[];
  antennas: Antenna[];
  windows: LitWindow[];
}

const CANVAS_WIDTH = 1600;
const GROUND = 1000;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const round = (n: number) => Math.round(n);
const fixed = (n: number, digits: number) => Number(n.toFixed(digits));

interface RowStyle {
  base: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  fill: string;
  /** Probabilidad de que una ventana esté encendida. */
  litRatio: number;
  brightness: number;
}

const ROWS: RowStyle[] = [
  { base: 870, minWidth: 50, maxWidth: 120, minHeight: 90, maxHeight: 260, fill: "#231C31", litRatio: 0.28, brightness: 0.6 },
  { base: 950, minWidth: 70, maxWidth: 150, minHeight: 60, maxHeight: 190, fill: "#15111F", litRatio: 0.4, brightness: 0.95 },
];

export function generateNightCity(seed = 20251119): NightCity {
  const random = seededRandom(seed);
  const city: NightCity = { stars: [], hillsideLights: [], buildings: [], antennas: [], windows: [] };

  for (let i = 0; i < 120; i++) {
    city.stars.push({
      cx: round(random() * CANVAS_WIDTH),
      cy: round(random() * 500),
      r: fixed(random() * 1.3 + 0.4, 1),
      opacity: fixed(random() * 0.55 + 0.2, 2),
    });
  }

  // Casas en las laderas: más altas hacia el centro del valle.
  for (let i = 0; i < 320; i++) {
    const x = random() * CANVAS_WIDTH;
    const top = 600 + 120 * (1 - Math.abs(x - 800) / 800);
    const y = top + 8 + random() * 200;
    city.hillsideLights.push({
      x: round(x),
      y: round(y),
      warm: random() < 0.85,
      opacity: fixed(random() * 0.6 + 0.35, 2),
    });
  }

  for (const row of ROWS) {
    let x = -20;
    while (x < CANVAS_WIDTH + 20) {
      const width = row.minWidth + random() * (row.maxWidth - row.minWidth);
      const top = row.base - (row.minHeight + random() * (row.maxHeight - row.minHeight));
      city.buildings.push({ x: round(x), y: round(top), width: round(width), height: round(GROUND - top), fill: row.fill });
      if (random() < 0.22) city.antennas.push({ x: round(x + width / 2), y: round(top), fill: row.fill });
      for (let wy = top + 12; wy < GROUND; wy += 18) {
        for (let wx = x + 8; wx < x + width - 12; wx += 14) {
          if (random() < row.litRatio) {
            city.windows.push({ x: round(wx), y: round(wy), opacity: fixed(row.brightness * (0.5 + random() * 0.5), 2) });
          }
        }
      }
      x += width + random() * 8;
    }
  }

  return city;
}
