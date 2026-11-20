import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

type Variant = "primary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary: styles.primary,
  ghost: styles.ghost,
};

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
}

/** Enlace con forma de botón (para anclas a secciones). */
export function LinkButton({ variant = "primary", className, ...props }: LinkButtonProps) {
  return <a className={cx(styles.button, variantClass[variant], className)} {...props} />;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cx(styles.button, variantClass[variant], className)} {...props} />;
}
