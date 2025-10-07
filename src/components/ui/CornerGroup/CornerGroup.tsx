import styles from "./CornerGroup.module.css";
import React from "react";

export function CornerGroup({ children }: { children?: React.ReactNode }) {
  return <div className={styles.cornerGroup}>{children}</div>;
}
