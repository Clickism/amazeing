import { useEffect, useRef, useState } from "react";
import styles from "./Viewport.module.css";
import clsx from "clsx";

import type { Owl } from "../../game/owl.ts";
import type { Level } from "../../game/level.ts";
import { renderCanvas } from "../../game/renderer.ts";
import { loadSprites, type SpriteMap } from "../../game/sprites.ts";

export type ViewportProps = {
  owl: Owl;
  level: Level;
};

export function Viewport({ owl, level }: ViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sprites, setSprites] = useState<SpriteMap | null>(null);

  const maze = level.maze;

  // Load sprites once
  useEffect(() => {
    loadSprites().then(setSprites);
  }, []);

  // Render when sprites are loaded
  useEffect(() => {
    if (!sprites) return; // wait for images
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderCanvas(canvas, maze, owl, sprites);
  }, [maze, owl, sprites]);

  return (
    <div className={clsx(styles.viewport, "window-border")}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
