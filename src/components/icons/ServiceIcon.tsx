import type { ServiceIconName } from "@/content/services";

interface ServiceIconProps {
  name: ServiceIconName;
  className?: string;
}

const OUTLINE = { fill: "none", stroke: "var(--lg1)", strokeWidth: 2.5 } as const;

export function ServiceIcon({ name, className }: ServiceIconProps) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden="true">
      {name === "web" && (
        <>
          <rect x="3" y="7" width="38" height="30" rx="5" {...OUTLINE} />
          <line x1="3" y1="15" x2="41" y2="15" {...OUTLINE} />
          <polygon points="10,22 24,22 17,32" fill="var(--lg2)" opacity=".8" />
          <rect x="27" y="22" width="9" height="3" rx="1.5" fill="var(--lg3)" />
          <rect x="27" y="28" width="6" height="3" rx="1.5" fill="var(--lg3)" />
        </>
      )}
      {name === "systems" && (
        <>
          <rect x="3" y="5" width="16" height="16" rx="4" fill="var(--lg1)" />
          <rect x="25" y="5" width="16" height="16" rx="4" {...OUTLINE} />
          <rect x="3" y="27" width="16" height="12" rx="4" {...OUTLINE} />
          <polygon points="25,39 41,39 33,25" fill="var(--lg2)" opacity=".8" />
        </>
      )}
      {name === "custom" && (
        <>
          <polyline points="14,12 4,22 14,32" {...OUTLINE} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="30,12 40,22 30,32" {...OUTLINE} strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="22,8 28,22 22,36 16,22" fill="var(--lg2)" opacity=".8" />
        </>
      )}
    </svg>
  );
}
