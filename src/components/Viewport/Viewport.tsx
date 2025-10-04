import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Window } from "../ui/Window/Window";
import styles from "./Viewport.module.css";

const MAZE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export function Viewport() {
  const { t } = useTranslation();

  const [owlPos, setOwlPos] = useState({ x: 1, y: 1 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  // Arrow key movement
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      let { x, y } = owlPos;
      if (e.key === "ArrowUp" && MAZE[y - 1][x] === 0) y--;
      if (e.key === "ArrowDown" && MAZE[y + 1][x] === 0) y++;
      if (e.key === "ArrowLeft" && MAZE[y][x - 1] === 0) x--;
      if (e.key === "ArrowRight" && MAZE[y][x + 1] === 0) x++;
      setOwlPos({ x, y });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [owlPos]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1 - e.deltaY * 0.001;
    setZoom((prev) => Math.min(3, Math.max(0.5, prev * zoomFactor)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
  };

  return (
    <Window title={t("viewport.title")}>
      <div
        className={styles.viewport}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className={styles.mazeContainer}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          {MAZE.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${
                  cell === 1 ? styles.wall : ""
                } ${owlPos.x === x && owlPos.y === y ? styles.owl : ""}`}
              />
            ))
          )}
        </div>
      </div>
    </Window>
  );
}
