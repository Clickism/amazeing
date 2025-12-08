import { Maze, type Wall } from "./maze";
import type { Owl } from "./owl";
import type { CardinalDirection } from "../interpreter/types";
import type { SpriteMap } from "./sprites";

const CELL_SIZE = 64;
const WALL_THICKNESS = 12;

export function renderCanvas(
  canvas: HTMLCanvasElement,
  maze: Maze,
  owl: Owl,
  sprites: SpriteMap,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rows = maze.height();
  const cols = maze.width();

  canvas.width = cols * CELL_SIZE;
  canvas.height = rows * CELL_SIZE;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  drawTiles(ctx, maze, sprites);
  drawWalls(ctx, maze, sprites);
  drawOwl(ctx, owl, sprites);
  ctx.restore();
}

function drawTiles(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  sprites: SpriteMap,
) {
  const rows = maze.height();
  const cols = maze.width();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tile = maze.tileAt({ x, y });
      if (!tile) continue;
      const img = sprites.tiles[tile.type];

      // full tile draw
      ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function drawWalls(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  sprites: SpriteMap,
) {
  const rows = maze.height();
  const cols = maze.width();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;

      const pos = { x, y };

      drawWallImage(
        ctx,
        sprites,
        px,
        py,
        CELL_SIZE,
        maze.wallAt(pos, "north"),
        "north",
      );
      drawWallImage(
        ctx,
        sprites,
        px,
        py,
        CELL_SIZE,
        maze.wallAt(pos, "south"),
        "south",
      );
      drawWallImage(
        ctx,
        sprites,
        px,
        py,
        CELL_SIZE,
        maze.wallAt(pos, "east"),
        "east",
      );
      drawWallImage(
        ctx,
        sprites,
        px,
        py,
        CELL_SIZE,
        maze.wallAt(pos, "west"),
        "west",
      );
    }
  }
}

function drawWallImage(
  ctx: CanvasRenderingContext2D,
  sprites: SpriteMap,
  x: number,
  y: number,
  cell: number,
  wall: Wall | null,
  dir: CardinalDirection,
) {
  if (!wall || wall.type === null) return;

  const img = sprites.walls[wall.type];

  switch (dir) {
    case "north":
      ctx.drawImage(img, x, y, cell, WALL_THICKNESS);
      break;

    case "south":
      ctx.drawImage(img, x, y + cell - WALL_THICKNESS, cell, WALL_THICKNESS);
      break;

    case "west":
      ctx.drawImage(img, x, y, WALL_THICKNESS, cell);
      break;

    case "east":
      ctx.drawImage(img, x + cell - WALL_THICKNESS, y, WALL_THICKNESS, cell);
      break;
  }
}

function drawOwl(ctx: CanvasRenderingContext2D, owl: Owl, sprites: SpriteMap) {
  const img = sprites.owl[owl.direction];
  ctx.drawImage(
    img,
    owl.position.x * CELL_SIZE,
    owl.position.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE,
  );
}
