import styles from "./Console.module.css";
import clsx from "clsx";

export function Console({ text }: { text: string }) {
  return <div className={clsx(styles.console, "window-border")}>{text}</div>;
}
