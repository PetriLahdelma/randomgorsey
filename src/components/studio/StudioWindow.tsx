import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./StudioWindow.module.css";

export interface StudioWindowProps {
  title: string;
  children: ReactNode;
  tone?: "paper" | "dark" | "blue";
  className?: string;
  actions?: ReactNode;
  inert?: boolean;
}
export function StudioWindow({ title, children, tone = "paper", className, actions, inert }: StudioWindowProps) {
  return (
    <section className={cn(styles.window, className)} data-tone={tone} aria-hidden={inert || undefined} inert={inert || undefined}>
      <div className={styles.titleBar}>
        <span className={styles.windowIcon} aria-hidden="true" />
        <span className={styles.title}>{title}</span>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
