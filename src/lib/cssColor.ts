/**
 * Resuelve un token de color de CSS (por ejemplo "--accent") al color que se ve en pantalla.
 *
 * getPropertyValue() devolvería el texto sin evaluar ("light-dark(#6E1E2A, #E3B48F)"),
 * así que se aplica el token a un elemento de prueba y se lee el color calculado.
 */
let probe: HTMLSpanElement | null = null;

export function resolveCssColor(token: `--${string}`): string {
  if (!probe) {
    probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
    document.body.appendChild(probe);
  }
  probe.style.color = `var(${token})`;
  return getComputedStyle(probe).color;
}
