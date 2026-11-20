import { generateNightCity } from "./nightCity";
import styles from "./HeroBackdrop.module.css";

/**
 * Fondo de la portada (componente de servidor: no envía JavaScript).
 * De día, el Illimani con sus tres cumbres; de noche, una ciudad con luces amarillas.
 * El tema activo decide cuál se ve mediante las variables --day-op y --night-op.
 */
export function HeroBackdrop() {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className={styles.svg}>
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--sky1)" }} />
          <stop offset="1" style={{ stopColor: "var(--sky2)" }} />
        </linearGradient>
      </defs>
      <Illimani />
      <NightCityLayer />
    </svg>
  );
}

function Illimani() {
  return (
    <g className={styles.day}>
      <rect width="1600" height="1000" fill="url(#hero-sky)" />
      {/* Cordillera lejana */}
      <polygon
        points="0,640 140,560 260,600 380,520 470,580 1250,600 1360,520 1470,570 1600,500 1600,760 0,760"
        style={{ fill: "var(--far)" }}
        opacity=".55"
      />
      {/* Macizo: tres cumbres, la sur más alta */}
      <polygon
        points="0,760 200,690 430,470 560,330 660,385 820,300 930,362 1060,262 1210,420 1420,560 1600,620 1600,1000 0,1000"
        style={{ fill: "var(--rock)" }}
      />
      <polygon points="560,330 610,520 430,470" style={{ fill: "var(--rock2)" }} opacity=".6" />
      <polygon points="1060,262 1110,520 1210,420" style={{ fill: "var(--rock2)" }} />
      <polygon points="1210,420 1150,620 1420,560" style={{ fill: "var(--rock2)" }} opacity=".7" />
      <polygon points="200,690 430,470 380,700" style={{ fill: "var(--rock2)" }} opacity=".5" />
      {/* Nieve */}
      <polygon
        points="440,462 560,330 660,385 820,300 930,362 1060,262 1205,416 1150,450 1100,428 1050,490 990,440 930,500 870,452 800,512 740,455 680,498 620,452 560,505 500,468"
        style={{ fill: "var(--snow)" }}
      />
      <polygon points="560,330 600,470 660,385" style={{ fill: "var(--snow2)" }} />
      <polygon points="820,300 860,460 930,362" style={{ fill: "var(--snow2)" }} />
      <polygon points="1060,262 1100,428 1205,416" style={{ fill: "var(--snow2)" }} />
      <polygon points="660,385 740,455 820,300" style={{ fill: "var(--snow2)" }} opacity=".45" />
      <polygon points="930,362 990,440 1060,262" style={{ fill: "var(--snow2)" }} opacity=".45" />
      {/* Lomas cercanas */}
      <polygon
        points="0,830 260,770 520,820 760,760 1010,815 1280,770 1600,820 1600,1000 0,1000"
        style={{ fill: "var(--hill)" }}
      />
      <polygon
        points="0,900 330,860 640,905 980,858 1300,900 1600,870 1600,1000 0,1000"
        style={{ fill: "var(--hill2)" }}
      />
      <polygon points="260,770 520,820 380,860" style={{ fill: "var(--hill2)" }} opacity=".35" />
      <polygon points="1010,815 1280,770 1180,850" style={{ fill: "var(--hill2)" }} opacity=".35" />
    </g>
  );
}

function NightCityLayer() {
  const city = generateNightCity();

  return (
    <g className={styles.night}>
      <defs>
        <linearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B0D1C" />
          <stop offset=".6" stopColor="#1D1530" />
          <stop offset="1" stopColor="#3A2234" />
        </linearGradient>
        <radialGradient id="night-glow" cx=".5" cy="1" r=".75">
          <stop offset="0" stopColor="#F2A54A" stopOpacity=".38" />
          <stop offset="1" stopColor="#F2A54A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="night-moon" cx=".5" cy=".5" r=".5">
          <stop offset=".55" stopColor="#F3E6CF" stopOpacity=".35" />
          <stop offset="1" stopColor="#F3E6CF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#night-sky)" />
      {city.stars.map((star, i) => (
        <circle key={i} cx={star.cx} cy={star.cy} r={star.r} fill="#F6EEE3" opacity={star.opacity} />
      ))}
      <circle cx="1330" cy="150" r="110" fill="url(#night-moon)" />
      <circle cx="1330" cy="150" r="42" fill="#F3E6CF" />
      {/* Silueta del Illimani al fondo */}
      <polygon
        points="280,640 430,470 560,330 660,385 820,300 930,362 1060,262 1210,420 1420,560 1520,640"
        fill="#262838"
      />
      <polygon
        points="440,462 560,330 660,385 820,300 930,362 1060,262 1205,416 1100,428 990,440 870,452 740,455 620,452 500,468"
        fill="#C9CBDA"
        opacity=".22"
      />
      <polygon points="0,600 220,640 480,690 800,720 1120,690 1380,640 1600,600 1600,1000 0,1000" fill="#1A1626" />
      <rect x="0" y="520" width="1600" height="480" fill="url(#night-glow)" />
      {city.hillsideLights.map((light, i) => (
        <rect
          key={i}
          x={light.x}
          y={light.y}
          width="2.6"
          height="2.6"
          fill={light.warm ? "#FFCF6B" : "#F6EEE3"}
          opacity={light.opacity}
        />
      ))}
      {city.buildings.map((building, i) => (
        <rect key={i} x={building.x} y={building.y} width={building.width} height={building.height} fill={building.fill} />
      ))}
      {city.antennas.map((antenna, i) => (
        <g key={i}>
          <rect x={antenna.x - 1} y={antenna.y - 20} width="2" height="20" fill={antenna.fill} />
          <circle cx={antenna.x} cy={antenna.y - 21} r="2.4" fill="#FF7A59" />
        </g>
      ))}
      {city.windows.map((pane, i) => (
        <rect key={i} x={pane.x} y={pane.y} width="6" height="9" fill="#FFD27A" opacity={pane.opacity} />
      ))}
    </g>
  );
}
