interface CheckIconProps {
  className?: string;
}

export function CheckIcon({ className }: CheckIconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <polygon points="10,1 19,10 10,19 1,10" fill="var(--lg2)" opacity=".25" />
      <polyline
        points="6,10 9,13 14,7"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
