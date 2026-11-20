import { PigeonMark } from "@/components/brand/Pigeon";
import { Wordmark } from "@/components/brand/Wordmark";
import { sectionHref } from "@/content/sections";
import { SITE } from "@/content/site";
import { cx } from "@/lib/cx";
import styles from "./ContactSection.module.css";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cx(styles.siteFooter, className)}>
      <a className={styles.logo} href={sectionHref("inicio")} aria-label={`${SITE.name}, inicio`}>
        <PigeonMark className={styles.logoMark} />
        <Wordmark />
      </a>
      <span>{SITE.domain}</span>
      <span>
        © {SITE.year} {SITE.name}
      </span>
    </footer>
  );
}
