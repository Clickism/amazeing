import { Panel, type PanelProps } from "../Panel.tsx";
import clsx from "clsx";
import styles from "./TextPanel.module.css";

export function TextPanel({ className, ...props }: PanelProps) {
  return <Panel {...props} className={clsx(className, styles.textPanel)} />;
}
