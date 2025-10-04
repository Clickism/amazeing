import styles from "./ButtonGroup.module.css";
import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  vertical?: boolean;
  stretch?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function ButtonGroup({
  children,
  vertical = false,
  stretch = false,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        styles.buttonGroup,
        vertical && styles.vertical,
        stretch && styles.stretch,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
