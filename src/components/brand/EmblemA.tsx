interface EmblemAProps {
  className?: string;
}

/** La "A" geométrica del navbar: punta triangular, hueco interior y travesaño bajo. */
export function EmblemA({ className }: EmblemAProps) {
  return (
    <svg viewBox="0 0 60 50" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        fill="#6E1E2A"
        d="M30 0 L60 50 L51.6 50 L46.8 42 L13.2 42 L8.4 50 L0 50 Z M30 14 L43.2 36 L16.8 36 Z"
      />
      <path
        fillRule="evenodd"
        fill="#2A0D12"
        opacity=".22"
        d="M30 0 L60 50 L51.6 50 L46.8 42 L30 42 L30 36 L43.2 36 L30 14 Z"
      />
      <polygon points="30,0 20.4,16 30,16 30,14" fill="#93303C" opacity=".55" />
      <polygon points="13.2,42 16.8,36 30,36 30,42" fill="#93303C" opacity=".35" />
    </svg>
  );
}
