import styles from "./ButtonGroup.module.css";
import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  vertical?: boolean;
  stretch?: boolean;
  center?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/**
 * A separator component to be used within ButtonGroup.
 */
function Separator() {
  return <div className={styles.separator} />;
}

export function ButtonGroup({
  children,
  vertical = false,
  stretch = false,
  center = false,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        styles.buttonGroup,
        vertical && styles.vertical,
        stretch && styles.stretch,
        center && styles.center,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

ButtonGroup.Separator = Separator;
