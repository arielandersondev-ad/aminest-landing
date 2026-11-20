/** Agrupa temporizadores para poder cancelarlos todos juntos al desmontar o interrumpir una animación. */
export class TimerBag {
  private readonly ids = new Set<ReturnType<typeof setTimeout>>();

  after(ms: number, callback: () => void): void {
    const id = setTimeout(() => {
      this.ids.delete(id);
      callback();
    }, ms);
    this.ids.add(id);
  }

  clear(): void {
    this.ids.forEach(clearTimeout);
    this.ids.clear();
  }
}
