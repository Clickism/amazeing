import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import styles from "./PanelContainer.module.css";
import { clamp } from "../../editor/utils.ts";

type PanelContainerProps = {
  children: ReactNode[];
  orientation?: "horizontal" | "vertical";
  initialSplit?: number;
  minSize?: number;
  maxSize?: number;
};

export function PanelContainer({
  children,
  orientation = "horizontal",
  initialSplit = 0.5,
  minSize = 0.1,
  maxSize = 0.9,
}: PanelContainerProps) {
  const [splitSize, setSplitSize] = useState<number>(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isHorizontal = orientation === "horizontal";

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newSplit;

      if (isHorizontal) {
        const relativeX = e.clientX - containerRect.left;
        newSplit = relativeX / containerRect.width;
      } else {
        const relativeY = e.clientY - containerRect.top;
        newSplit = relativeY / containerRect.height;
      }

      newSplit = clamp(newSplit, minSize, maxSize);
      setSplitSize(newSplit);
    },
    [isDragging, isHorizontal, maxSize, minSize],
  );

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp, isHorizontal]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ flexDirection: isHorizontal ? "row" : "column" }}
    >
      <div
        style={{
          flexBasis: `${splitSize * 100}%`,
          flexGrow: 0,
          flexShrink: 0,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {children[0]}
      </div>

      <div className={styles.resizerContainer}>
        <div
          className={clsx(
            styles.resizer,
            isDragging && styles.active,
            isHorizontal ? styles.horizontal : styles.vertical,
          )}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {children[1]}
      </div>
    </div>
  );
}
