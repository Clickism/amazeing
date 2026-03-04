import type { OwlData } from "../owl.ts";
import type { CardinalDirection, Position } from "../../interpreter/types.ts";
import type { SpriteMap } from "./sprites.ts";
import type { Level } from "../level.ts";
import { clamp } from "../../../features/editor/utils.ts";
import type { MarkData } from "../marks.ts";

export const OWL_SIZE = 32;
export const CELL_SIZE = 32;

export type Camera = {
  position: Position;
  zoom: number;
};

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  level: Level;
  owl: OwlData;
  sprites: SpriteMap;
  dpr: number = window.devicePixelRatio || 1;
  camera: Camera;
  marks: MarkData;

  constructor(
    canvas: HTMLCanvasElement,
    level: Level,
    owl: OwlData,
    sprites: SpriteMap,
    camera: Camera,
    marks: MarkData,
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2D context");
    this.ctx = ctx;
    this.level = level;
    this.owl = owl;
    this.sprites = sprites;
    this.camera = camera;
    this.marks = marks;
  }

  render() {
    const ctx = this.ctx;
    const dpr = this.dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(dpr * this.camera.zoom, dpr * this.camera.zoom);
    ctx.translate(-this.camera.position.x, -this.camera.position.y);

    ctx.imageSmoothingEnabled = false;

    this.drawWaterTiles();
    this.drawTiles();
    this.drawWalls();
    if (this.level.data.finishPosition)
      this.drawFinish(this.level.data.finishPosition);
    this.drawMarks();
    this.drawOwl();
    ctx.restore();
  }

  drawWaterTiles() {
    const img = this.sprites.water;
    // Calculate visible bounds in world space to cull tiles
    const zoomScale = this.dpr * this.camera.zoom;
    const halfW = this.canvas.width / 2 / zoomScale;
    const halfH = this.canvas.height / 2 / zoomScale;

    const left = this.camera.position.x - halfW;
    const top = this.camera.position.y - halfH;
    const right = this.camera.position.x + halfW;
    const bottom = this.camera.position.y + halfH;

    const startX = Math.floor(left / CELL_SIZE) - 1;
    const startY = Math.floor(top / CELL_SIZE) - 1;
    const endX = Math.ceil(right / CELL_SIZE) + 1;
    const endY = Math.ceil(bottom / CELL_SIZE) + 1;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.drawImageAt(img, { x, y }, true);
      }
    }
  }

  drawTiles() {
    const maze = this.level.maze;
    const rows = maze.height();
    const cols = maze.width();

    // Render fake tiles including border
    for (let y = -1; y <= rows; y++) {
      for (let x = -1; x <= cols; x++) {
        const hasTile = this.hasFakeTileAt({ x, y });
        if (!hasTile) continue;
        const tileset = this.sprites.tilesets[maze.data.theme];
        this.drawTilesetTile(tileset, { x, y });
      }
    }
  }

  drawWalls() {
    const maze = this.level.maze;
    maze.forEachHorizontalWall((position) => {
      this.drawHorizontalWall(position);
    });
    maze.forEachVerticalWall((position) => {
      this.drawVerticalWall(position);
    });
    this.drawOuterWalls();
  }

  drawOuterWalls() {
    const maze = this.level.maze;
    const rows = maze.height();
    const cols = maze.width();
    for (let x = 0; x < cols; x++) {
      this.drawHorizontalWall({ x, y: -1 });
      this.drawHorizontalWall({ x, y: rows - 1 });
    }
    for (let y = 0; y < rows; y++) {
      this.drawVerticalWall({ x: -1, y });
      this.drawVerticalWall({ x: cols - 1, y });
    }
  }

  drawHorizontalWall(position: Position) {
    const x = position.x;
    const y = position.y + 0.5;
    const theme = this.level.maze.data.theme;
    const img = this.sprites.walls[theme].horizontal;
    this.drawImageAt(img, { x, y });
  }

  drawVerticalWall(position: Position) {
    const x = position.x + 0.5;
    const y = position.y;
    const theme = this.level.maze.data.theme;
    const img = this.sprites.walls[theme].vertical;
    this.drawImageAt(img, { x, y });
  }

  drawOwl() {
    const img = this.sprites.owl[this.owl.direction];
    this.drawImageAt(img, this.owl.position);
  }

  drawFinish(position: Position) {
    const img = this.sprites.finish;
    this.drawImageAt(img, position);
  }

  drawMarks() {
    const marks = this.marks.marks;
    for (let y = 0; y < marks.length; y++) {
      for (let x = 0; x < marks[y].length; x++) {
        const mark = marks[y][x];
        if (mark & 1) {
          // West
          this.drawMarkInDirection({ x, y }, "west");
        }
        if (mark & (1 << 1)) {
          // South
          this.drawMarkInDirection({ x, y }, "south");
        }
        if (mark & (1 << 2)) {
          // East
          this.drawMarkInDirection({ x, y }, "east");
        }
        if (mark & (1 << 3)) {
          // North
          this.drawMarkInDirection({ x, y }, "north");
        }
      }
    }
  }

  drawMarkInDirection(position: Position, direction: CardinalDirection) {
    const img = this.sprites.markRight;
    const rotationMap: Record<CardinalDirection, number> = {
      east: 0,
      south: Math.PI / 2,
      west: Math.PI,
      north: -Math.PI / 2,
    };
    const angle = rotationMap[direction];
    // Compute the center of the cell in world coordinates
    const cx = position.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = position.y * CELL_SIZE + CELL_SIZE / 2;
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.drawImage(
      img,
      -img.width / 2,
      -img.height / 2,
      img.width,
      img.height,
    );
    ctx.restore();
  }

  private hasFakeTileAt(position: Position): boolean {
    const maze = this.level.maze;
    const { x, y } = position;
    // Clamp to border bounds
    const clampedX = clamp(x, -1, maze.width());
    const clampedY = clamp(y, -1, maze.height());
    // Within border bounds
    if (clampedX === x && clampedY === y) {
      const clampedPos = {
        x: clamp(x, 0, maze.width() - 1),
        y: clamp(y, 0, maze.height() - 1),
      };
      return maze.hasTileAt(clampedPos);
    }
    // Outside border bounds
    return false;
  }

  private drawTilesetTile(img: HTMLImageElement, pos: Position) {
    const north = this.hasFakeTileAt({ x: pos.x, y: pos.y - 1 });
    const south = this.hasFakeTileAt({ x: pos.x, y: pos.y + 1 });
    const west = this.hasFakeTileAt({ x: pos.x - 1, y: pos.y });
    const east = this.hasFakeTileAt({ x: pos.x + 1, y: pos.y });

    let sx = 1; // Center
    let sy = 1; // Center
    // Determine column
    if (west) sx += 1;
    if (east) sx -= 1;
    // Determine row
    if (north) sy += 1;
    if (south) sy -= 1;

    this.ctx.drawImage(
      img,
      sx * CELL_SIZE,
      sy * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE,
      pos.x * CELL_SIZE,
      pos.y * CELL_SIZE,
      CELL_SIZE + 1, // Buffer
      CELL_SIZE + 1, // Buffer
    );
  }

  private drawImageAt(
    img: HTMLImageElement,
    position: Position,
    buffer = false,
  ) {
    const width = img.width;
    const height = img.height;
    this.ctx.drawImage(
      img,
      position.x * CELL_SIZE + (CELL_SIZE - width) / 2,
      position.y * CELL_SIZE + (CELL_SIZE - height) / 2,
      width + (buffer ? 1 : 0),
      height + (buffer ? 1 : 0),
    );
  }
}
