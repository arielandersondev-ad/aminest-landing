const EDGE_TOLERANCE_PX = 2;

/** Un panel sin scroll propio (la portada) cuenta siempre como "en el borde". */
export function isScrollable(panel: HTMLElement): boolean {
  return (
    getComputedStyle(panel).overflowY !== "hidden" &&
    panel.scrollHeight > panel.clientHeight + EDGE_TOLERANCE_PX
  );
}

export function isAtBottom(panel: HTMLElement): boolean {
  return (
    !isScrollable(panel) ||
    panel.scrollTop + panel.clientHeight >= panel.scrollHeight - EDGE_TOLERANCE_PX
  );
}

export function isAtTop(panel: HTMLElement): boolean {
  return !isScrollable(panel) || panel.scrollTop <= EDGE_TOLERANCE_PX;
}
