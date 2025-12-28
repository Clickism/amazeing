import React, { useEffect, useRef, useState } from "react";
import styles from "./Viewport.module.css";
import clsx from "clsx";
import { type Camera, Renderer } from "../../../game/renderer.ts";
import { loadSprites, type SpriteMap } from "../../../game/sprites.ts";
import type { Position } from "../../../interpreter/types.ts";
import { CornerGroup } from "../../../components/CornerGroup/CornerGroup.tsx";
import { Button } from "../../../components/Button/Button.tsx";
import { FaRegMap } from "react-icons/fa";
import type { Owl } from "../../../game/owl.ts";
import type { Level } from "../../../game/level.ts";
import { useTranslation } from "react-i18next";
import { Popover } from "../../../components/popup/Popover/Popover.tsx";

const ZOOM_SPEED = 0.0015;

export type ViewportProps = {
  owl: Owl;
  level: Level;
  levelSelector?: boolean;
};

export function Viewport({ owl, level, levelSelector }: ViewportProps) {
  const { t} = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sprites, setSprites] = useState<SpriteMap | null>(null);

  // Camera
  const [camera, setCamera] = useState<Camera>({
    position: { x: 0, y: 0 },
    zoom: 1,
  });
  const dragging = useRef(false);
  const lastCameraPos = useRef<Position>({ ...camera.position });
  const dpr = window.devicePixelRatio || 1;

  const maze = level.maze;

  // Load sprites once
  useEffect(() => {
    loadSprites().then(setSprites);
  }, []);

  // Render when sprites are loaded
  useEffect(() => {
    if (!sprites) return; // Wait for images
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const renderer = new Renderer(canvas, maze, owl, sprites, camera);
      renderer.render();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [camera, maze, owl, sprites]);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastCameraPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;

    const dx = (e.clientX - lastCameraPos.current.x) / (camera.zoom * dpr);
    const dy = (e.clientY - lastCameraPos.current.y) / (camera.zoom * dpr);

    lastCameraPos.current = { x: e.clientX, y: e.clientY };

    setCamera((c) => ({
      ...c,
      position: {
        x: c.position.x - dx,
        y: c.position.y - dy,
      },
    }));
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const scale = Math.exp(-e.deltaY * ZOOM_SPEED);

    setCamera((c) => {
      const newZoom = Math.min(Math.max(c.zoom * scale, 0.25), 8);
      return {
        ...c,
        zoom: newZoom,
      };
    });
  };

  return (
    <div className={clsx(styles.viewport, "window-border")}>
      {levelSelector && (
        <CornerGroup position="top-right">
          <Popover
            title={t("viewport.levelSelector.title")}
            trigger={
              <Button shape="icon">
                <FaRegMap />
              </Button>
            }
          >
            <>
              Hello
            </>
          </Popover>
        </CornerGroup>
      )}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onWheel}
      />
    </div>
  );
}
