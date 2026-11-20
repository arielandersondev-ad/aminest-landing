import type { UpcomingIconName } from "@/content/upcoming";

interface UpcomingIconProps {
  name: UpcomingIconName;
  className?: string;
}

/* Siempre sobre la banda vino, por eso los colores son fijos y no dependen del tema */
const LINE = { fill: "none", stroke: "#F1DCC6", strokeWidth: 2.2 } as const;
const GEM = "#D9BE98";

export function UpcomingIcon({ name, className }: UpcomingIconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {name === "payments" && (
        <>
          <rect x="3" y="9" width="34" height="22" rx="4" {...LINE} />
          <line x1="3" y1="16" x2="37" y2="16" {...LINE} />
          <polygon points="24,22 32,22 28,28" fill={GEM} />
        </>
      )}
      {name === "paper-to-digital" && (
        <>
          <path d="M9 4h15l7 7v25H9z" {...LINE} strokeLinejoin="round" />
          <line x1="14" y1="18" x2="26" y2="18" {...LINE} strokeWidth="2" />
          <line x1="14" y1="24" x2="22" y2="24" {...LINE} strokeWidth="2" />
          <polygon points="28,24 36,30 28,36 20,30" fill={GEM} />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect x="4" y="7" width="32" height="29" rx="4" {...LINE} />
          <line x1="4" y1="15" x2="36" y2="15" {...LINE} />
          <line x1="12" y1="4" x2="12" y2="10" {...LINE} strokeLinecap="round" />
          <line x1="28" y1="4" x2="28" y2="10" {...LINE} strokeLinecap="round" />
          <polygon points="20,19 26,25 20,31 14,25" fill={GEM} />
        </>
      )}
    </svg>
  );
}
