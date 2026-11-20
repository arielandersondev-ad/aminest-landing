# AmiNest · Landing

Landing de [aminesttech.com](https://aminesttech.com): páginas web, sistemas web y software a medida.

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · three.js

## Scripts

```bash
npm run dev     # desarrollo en http://localhost:3000
npm run build   # build de producción (la página se genera estática)
npm run start   # sirve el build
npm run lint
```

## Cómo funciona

La página es una **pista horizontal de paneles**: cada sección ocupa la pantalla completa y tiene su propio scroll vertical.

- **Avanzar**: la paloma se prepara, despega y vuela hacia la cámara. Cuando cruza 2/3 de la pantalla, la sección actual sale por la izquierda y la nueva entra por la derecha. Luego una paloma pequeña se posa abajo a la izquierda.
- **Retroceder**: la sección se desliza y la paloma vuelve caminando y se da la vuelta.
- **Resistencia en el borde**: el gesto que te trae al final de una sección nunca cambia de sección. Hace falta un empujón nuevo, y una pista muestra a dónde lleva.
- **Portada**: una escena 3D (three.js) en la que la paloma se posa en la N de "AmiNest", la cámara se aleja y cae una pluma.
- **Tema**: Sistema, Claro u Oscuro. Se aplica antes de pintar para que no parpadee.

## Estructura

```
src/
├── app/                  layout (fuentes, metadatos, tema inicial), página, estilos globales
├── content/              textos y datos: secciones, servicios, proyectos, módulos, proceso
├── styles/tokens.css     paleta y tokens de diseño (claro/oscuro con light-dark())
├── lib/                  utilidades sin dominio: store, media queries, temporizadores, colores
├── components/
│   ├── brand/            paloma, "A" del navbar, wordmark
│   ├── icons/            íconos SVG
│   └── ui/               Section, SectionHeader, Button, Container
├── sections/             una carpeta/archivo por sección (componentes de servidor)
└── features/
    ├── panels/           pista horizontal: navegador, gestos, resistencia, pager, pista de borde
    ├── pigeon/           paloma animada: trayectoria de vuelo (pura) y coreografía
    ├── hero/             portada: escena 3D y fondo (Illimani / ciudad de noche)
    ├── navbar/           navbar de vidrio, menú móvil
    ├── theme/            selector de tema
    ├── feathers/         plumas que caen al cambiar de sección
    └── intro/            estado de la intro (oculta el navbar mientras se reproduce)
```

### Decisiones

- **El contenido vive en `src/content/`.** El orden de las secciones, sus nombres y en qué lado del navbar aparecen salen de `content/sections.ts`, y lo usan la página, el navbar, el menú móvil y la pista de borde.
- **Las secciones son componentes de servidor.** Solo el formulario, el navbar, la portada y la pista envían JavaScript.
- **La lógica de animación no depende de React.** `PanelNavigator`, `PigeonChoreographer`, `EdgeGesture` y `planFlight` son clases y funciones TypeScript que reciben elementos del DOM; los componentes solo las crean y las conectan. `planFlight` y `EdgeGesture` son puras y se pueden probar sin navegador.
- **Estado compartido sin Providers.** `lib/store.ts` es un store mínimo leído con `useSyncExternalStore`, para que el código imperativo (animaciones, escena 3D) y los componentes compartan el panel activo y la fase de la intro.
- **Accesibilidad.** Los paneles fuera de pantalla son `inert`; la opción actual usa `aria-current`; el menú móvil se cierra con Escape y devuelve el foco; con `prefers-reduced-motion` no hay vuelos ni intro animada.

## Pendiente

- Conectar el formulario de contacto (correo, WhatsApp o un endpoint propio) en `sections/contact/ContactForm.tsx`.
- El botón izquierdo del navbar solo abre el menú en pantallas angostas; en escritorio todavía no tiene función.
