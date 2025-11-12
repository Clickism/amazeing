import styles from "./CornerGroup.module.css";
import React from "react";
import clsx from "clsx";

type Props = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function CornerGroup({
  children,
  className,
  position = "top-right",
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        styles.cornerGroup,
        className,
        styles[`position-${position}`],
      )}
      {...props}
    >
      {children}
    </div>
  );
}
