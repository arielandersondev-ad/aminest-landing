import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import { SITE } from "@/content/site";
import { THEME_INIT_SCRIPT } from "@/features/theme/themeConfig";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-sora" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-manrope" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} · ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "es_BO",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1413" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El script de tema puede añadir data-theme antes de hidratar; es intencional.
    <html
      lang="es"
      className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
