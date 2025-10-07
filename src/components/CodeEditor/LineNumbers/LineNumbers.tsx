import styles from "../CodeEditor.module.css";
import { FaArrowRight } from "react-icons/fa";

export function LineNumbers({
  lineNumbers,
  currentLine,
}: {
  lineNumbers: number;
  currentLine: number | null;
}) {
  return (
    <div className={styles.lineNumbers}>
      {Array.from({ length: lineNumbers }).map((_, i) => (
        <div key={i}>
          <span className={styles.currentLineIndicator}>
            {currentLine === i + 1 && <FaArrowRight size={10} />}
          </span>
          <span className={styles.lineNumber}>{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
