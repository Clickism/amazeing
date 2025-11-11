import styles from "../CodeEditor.module.css";
import { type CSSProperties, useEffect, useState } from "react";
import clsx from "clsx";

function getTransitionDuration(runSpeed?: number) {
  if (!runSpeed) return "100ms";
  if (runSpeed >= 50) {
    return "0ms";
  }
  if (runSpeed >= 10) {
    return `${1000 / (runSpeed * 1.2)}ms`;
  }
  return "100ms";
}

export function LineNumbers({
  lineNumbers,
  currentLine,
  runSpeed,
  isRunning,
  fontSize,
}: {
  lineNumbers: number;
  currentLine: number | null;
  runSpeed?: number;
  isRunning?: boolean;
  fontSize: number;
}) {
  const [prevLine, setPrevLine] = useState<number | null>(null);
  useEffect(() => {
    if (currentLine !== null) {
      setPrevLine(currentLine);
    }
  }, [currentLine]);
  const isVisible = currentLine !== null && currentLine >= 0;
  const overlayLine = getOverlayLine(currentLine, lineNumbers);
  const isResetting = currentLine === null && prevLine !== null;
  return (
    <>
      <div
        className={clsx(
          styles.currentLineOverlay,
          isVisible && styles.visible,
          isResetting && styles.resetting,
        )}
        style={
          {
            "--line-number": overlayLine,
            "--line-number-transition-duration":
              isRunning && getTransitionDuration(runSpeed),
          } as CSSProperties
        }
      />
      <div className={styles.lineNumbers}>
        {Array.from({ length: lineNumbers }).map((_, i) => (
          <div key={i}>
            {/*<span className={styles.currentLineIndicator}>*/}
            {/*  {currentLine === i + 1 && <FaArrowRight size={10} />}*/}
            {/*</span>*/}
            <span
              className={styles.lineNumber}
              style={{
                fontSize: `${fontSize}px`,
              }}
            >
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function getOverlayLine(currentLine: number | null, lineNumbers: number) {
  if (currentLine !== null) {
    if (currentLine >= 0) {
      return currentLine;
    }
    return lineNumbers; // Use the one after last line when program is terminated.
  } else {
    return 1; // Default to first line
  }
}
