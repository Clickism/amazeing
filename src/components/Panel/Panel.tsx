import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import styles from "./Panel.module.css";

type PanelProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  borderless?: boolean;
  paddingless?: boolean;
  stretch?: "vertical" | "horizontal" | "both" | "none";
};

export function Panel({
  children,
  borderless,
  paddingless,
  className = "",
  style = {},
  stretch = "vertical",
}: PanelProps) {
  return (
    <div
      className={clsx(
        styles.panel,
        !borderless && styles.border,
        !paddingless && styles.padding,
        stretch === "vertical" && styles.stretchVertical,
        stretch === "horizontal" && styles.stretchHorizontal,
        stretch === "both" &&
          styles.stretchVertical &&
          styles.stretchHorizontal,
        className,
      )}
      style={{ overflow: "auto", ...style }}
    >
      {children}
    </div>
  );
}
