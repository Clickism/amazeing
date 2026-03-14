import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./IconText.module.css";
import clsx from "clsx";

type IconTextProps = {
  icon: ReactNode;
  size?: number | string;
  top?: number | string;
  children: ReactNode | ReactNode[];
} & HTMLAttributes<HTMLDivElement>;

export function IconText({
  icon,
  size = "14px",
  top = "2px",
  children,
  className,
  ...props
}: IconTextProps) {
  return (
    <div className={clsx(styles.container, className)} {...props}>
      <div
        className={styles.icon}
        style={{ "--icon-size": size, marginTop: top } as CSSProperties}
      >
        {icon as unknown as ReactNode}
      </div>
      <div>{children}</div>
    </div>
  );
}
