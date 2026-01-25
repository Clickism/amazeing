import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import styles from "./PanelContainer.module.css";

type PanelContainerProps = {
  children: ReactNode[];
  orientation?: "horizontal" | "vertical";
  initialSizes?: number[];
  minSize?: number;
};

export function PanelContainer({
  children,
  orientation = "horizontal",
  initialSizes,
  minSize = 0.1,
}: PanelContainerProps) {
  const panelCount = children.length;
  const [sizes, setSizes] = useState<number[]>(
    initialSizes && initialSizes.length === panelCount
      ? initialSizes
      : Array(panelCount).fill(1 / panelCount),
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const isHorizontal = orientation === "horizontal";

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingIndex(index);
  };

  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingIndex === null || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const delta = isHorizontal
        ? e.movementX / rect.width
        : e.movementY / rect.height;

      setSizes((prev) => {
        const next = [...prev];

        const a = next[draggingIndex];
        const b = next[draggingIndex + 1];

        const maxPositive = b - minSize;
        const maxNegative = a - minSize;

        const clampedDelta = Math.max(
          -maxNegative,
          Math.min(maxPositive, delta),
        );

        next[draggingIndex] = a + clampedDelta;
        next[draggingIndex + 1] = b - clampedDelta;

        return next;
      });
    },
    [draggingIndex, isHorizontal, minSize],
  );

  useEffect(() => {
    if (draggingIndex !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [draggingIndex, handleMouseMove, handleMouseUp, isHorizontal]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ flexDirection: isHorizontal ? "row" : "column" }}
    >
      {children.map((child, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              flexBasis: 0,
              flexGrow: sizes[i],
              flexShrink: 0,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            {child}
          </div>
          {i < panelCount - 1 && (
            <div className={styles.resizerContainer}>
              <div
                className={clsx(
                  styles.resizer,
                  draggingIndex === i && styles.active,
                  isHorizontal ? styles.horizontal : styles.vertical,
                )}
                onMouseDown={handleMouseDown(i)}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
