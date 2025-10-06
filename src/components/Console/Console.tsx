import styles from "./Console.module.css";

export function Console({ text }: { text: string }) {
  return <div className={styles.console}>{text}</div>;
}
