import type { ThemePreference } from "@/features/theme/themeConfig";

interface ThemeIconProps {
  preference: ThemePreference;
  className?: string;
}

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;

export function ThemeIcon({ preference, className }: ThemeIconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      {preference === "system" && (
        <>
          <rect x="2.5" y="3.5" width="15" height="10" rx="2" {...STROKE} />
          <line x1="7" y1="17" x2="13" y2="17" {...STROKE} strokeLinecap="round" />
        </>
      )}
      {preference === "light" && (
        <>
          <circle cx="10" cy="10" r="3.6" {...STROKE} />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="10" y1="1.8" x2="10" y2="3.6" />
            <line x1="10" y1="16.4" x2="10" y2="18.2" />
            <line x1="1.8" y1="10" x2="3.6" y2="10" />
            <line x1="16.4" y1="10" x2="18.2" y2="10" />
            <line x1="4.2" y1="4.2" x2="5.5" y2="5.5" />
            <line x1="14.5" y1="14.5" x2="15.8" y2="15.8" />
            <line x1="4.2" y1="15.8" x2="5.5" y2="14.5" />
            <line x1="14.5" y1="5.5" x2="15.8" y2="4.2" />
          </g>
        </>
      )}
      {preference === "dark" && (
        <path
          d="M15.5 12.6A6.5 6.5 0 0 1 7.4 4.5a6.5 6.5 0 1 0 8.1 8.1z"
          {...STROKE}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
