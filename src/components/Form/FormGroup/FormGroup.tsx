import type { ReactNode } from "react";
import styles from "./FormGroup.module.css";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  stretch?: boolean;
  horizontal?: boolean;
};

export function FormGroup({ children, stretch, horizontal }: Props) {
  return (
    <div
      className={clsx(
        styles.formGroup,
        stretch && styles.stretch,
        horizontal && styles.horizontal,
      )}
    >
      {children}
    </div>
  );
}
