import React, { useEffect, useRef, useState } from "react";
import styles from "./Viewport.module.css";
import clsx from "clsx";
import { type Camera, CELL_SIZE, Renderer } from "../../../game/renderer.ts";
import { loadSprites, type SpriteMap } from "../../../game/sprites.ts";
import type { Position } from "../../../interpreter/types.ts";
import { CornerGroup } from "../../../components/CornerGroup/CornerGroup.tsx";
import type { Owl } from "../../../game/owl.ts";
import type { Level } from "../../../game/level.ts";
import { LevelSelector } from "./LevelSelector/LevelSelector.tsx";
import { Button } from "../../../components/Button/Button.tsx";
import { ButtonGroup } from "../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Tooltip } from "../../../components/popup/Tooltip/Tooltip.tsx";
import { TbLock, TbLockOpen2 } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const ZOOM_SPEED = 0.0015;
const DEFAULT_ZOOM = 4;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

export type ViewportProps = {
  owl: Owl;
  level: Level;
  levelSelector?: boolean;
};

export function Viewport({ owl, level, levelSelector = false }: ViewportProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sprites, setSprites] = useState<SpriteMap | null>(null);
  const [following, setFollowing] = useState(true);

  // Camera at center
  const [camera, setCamera] = useState<Camera>({
    position: {
      x: (level.maze.width() * CELL_SIZE) / 2,
      y: (level.maze.height() * CELL_SIZE) / 2,
    },
    zoom: DEFAULT_ZOOM,
  });

  const dragging = useRef(false);
  const lastInputPos = useRef<Position>({ x: 0, y: 0 });
  const dpr = window.devicePixelRatio || 1;

  const maze = level.maze;

  // Load sprites once
  useEffect(() => {
    loadSprites().then(setSprites);
  }, []);

  // Render when sprites are loaded
  useEffect(() => {
    if (!sprites || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const renderFrame = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const renderer = new Renderer(canvas, maze, owl, sprites, camera);
      renderer.render();
    };

    renderFrame();
    window.addEventListener("resize", renderFrame);
    return () => window.removeEventListener("resize", renderFrame);
  }, [camera, dpr, maze, owl, sprites]);

  // Mouse events
  const handleDragStart = (x: number, y: number) => {
    if (following) return;
    dragging.current = true;
    lastInputPos.current = { x, y };
  };

  const handleDragEnd = () => {
    dragging.current = false;
  };

  const handleMove = (x: number, y: number) => {
    if (!dragging.current) return;

    const moveFactor = camera.zoom * dpr;
    const dx = (x - lastInputPos.current.x) / moveFactor;
    const dy = (y - lastInputPos.current.y) / moveFactor;

    lastInputPos.current = { x, y };

    setCamera((c) => ({
      ...c,
      position: {
        x: c.position.x - dx,
        y: c.position.y - dy,
      },
    }));
  };

  const onWheel = (e: React.WheelEvent) => {
    const zoomDelta = Math.exp(-e.deltaY * ZOOM_SPEED);
    setCamera((c) => {
      const newZoom = Math.min(
        Math.max(c.zoom * zoomDelta, MIN_ZOOM),
        MAX_ZOOM,
      );
      return {
        ...c,
        zoom: newZoom,
      };
    });
  };

  return (
    <div className={clsx(styles.viewport, "window-border")}>
      <CornerGroup position="top-right">
        <ButtonGroup>
          <Tooltip
            content={
              following
                ? t("viewport.camera.unlock")
                : t("viewport.camera.lock")
            }
          >
            <Button
              variant={following ? "secondary" : "success"}
              shape="icon"
              onClick={() => setFollowing((f) => !f)}
            >
              {following ? <TbLock size={18} /> : <TbLockOpen2 size={18} />}
            </Button>
          </Tooltip>
          {levelSelector && <LevelSelector />}
        </ButtonGroup>
      </CornerGroup>

      <canvas
        ref={canvasRef}
        className={clsx(styles.canvas, !following && styles.unlocked)}
        style={{ touchAction: "none" }}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        // Mobile Support
        onTouchStart={(e) =>
          handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchMove={(e) =>
          handleMove(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchEnd={handleDragEnd}
        onWheel={onWheel}
      />
    </div>
  );
}
