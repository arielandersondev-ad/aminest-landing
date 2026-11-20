import { cx } from "@/lib/cx";
import styles from "./Wordmark.module.css";

interface WordmarkProps {
  className?: string;
}

/** "AmiNest" en Sora 600: "Ami" en vino, "Nest" en tinta. */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cx(styles.word, className)}>
      <b className={styles.ami}>Ami</b>Nest
    </span>
  );
}
