import React, { useEffect, useRef, useState } from "react";
import styles from "./Viewport.module.css";
import clsx from "clsx";
import {
  type Camera,
  CELL_SIZE,
  Renderer,
} from "../../../../core/game/rendering/renderer.ts";
import {
  loadSprites,
  type SpriteMap,
} from "../../../../core/game/rendering/sprites.ts";
import type { Position } from "../../../../core/interpreter/types.ts";
import { CornerGroup } from "../../../../shared/components/CornerGroup/CornerGroup.tsx";
import type { OwlData } from "../../../../core/game/owl.ts";
import type { Level, LevelData } from "../../../../core/game/level.ts";
import { LevelSelector } from "./LevelSelector/LevelSelector.tsx";
import { Button } from "../../../../shared/components/Button/Button.tsx";
import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { Tooltip } from "../../../../shared/components/floating/Tooltip/Tooltip.tsx";
import { TbLock, TbLockOpen2 } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import type { FileStorage } from "../../context/storage/fileStorage.ts";

const ZOOM_SPEED = 0.0015;
const DEFAULT_ZOOM = 4;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

export type ViewportProps = {
  owl: OwlData;
  level: Level;
  /**
   * Allows changing the level in the viewport, and uses the
   * provided level storage to save and load levels.
   *
   * If not provided, the level is fixed and cannot be changed by the user.
   */
  levelStorage?: FileStorage<LevelData>;
  lockCamera?: boolean;
  lockCameraControls?: boolean;
};

export function Viewport({
  owl,
  level,
  levelStorage,
  lockCamera = true,
  lockCameraControls = true,
}: ViewportProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sprites, setSprites] = useState<SpriteMap | null>(null);
  const [following, setFollowing] = useState(lockCamera);

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

  // Load sprites once
  useEffect(() => {
    loadSprites().then(setSprites);
  }, []);

  // Render when sprites are loaded
  useEffect(() => {
    if (!sprites || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    const renderFrame = () => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const renderer = new Renderer(canvas, level, owl, sprites, camera);
      renderer.render();
    };

    renderFrame();

    const resizeObserver = new ResizeObserver(renderFrame);

    if (parent) {
      resizeObserver.observe(parent);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [camera, dpr, level, owl, sprites]);

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
    if (following) return;
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
    <div className={styles.viewport}>
      <CornerGroup position="top-right">
        <ButtonGroup>
          {lockCameraControls && (
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
          )}
          {levelStorage && <LevelSelector levelStorage={levelStorage} />}
        </ButtonGroup>
      </CornerGroup>

      <canvas
        ref={canvasRef}
        className={clsx(styles.canvas, !following && styles.unlocked)}
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
