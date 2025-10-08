import styles from "./CornerGroup.module.css";
import React from "react";
import clsx from "clsx";

type Props = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function CornerGroup({ children, className, ...props }: Props) {
  return (
    <div className={clsx(styles.cornerGroup, className)} {...props}>
      {children}
    </div>
  );
}
