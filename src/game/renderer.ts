import { type WallType } from "./maze";
import type { Owl } from "./owl";
import type { Position } from "../interpreter/types";
import type { SpriteMap } from "./sprites";
import type { Level } from "./level.ts";

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
  owl: Owl;
  sprites: SpriteMap;
  dpr: number = window.devicePixelRatio || 1;
  camera: Camera;

  constructor(
    canvas: HTMLCanvasElement,
    level: Level,
    owl: Owl,
    sprites: SpriteMap,
    camera: Camera,
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2D context");
    this.ctx = ctx;
    this.level = level;
    this.owl = owl;
    this.sprites = sprites;
    this.camera = camera;
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
    this.drawFinish(this.level.data.finishPosition);
    this.drawOwl(); // Now uses visualOwlPos
    ctx.restore();
  }

  drawWaterTiles() {
    const img = this.sprites.tiles.water;
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
        this.drawImageAt(img, { x, y });
      }
    }
  }

  drawTiles() {
    const maze = this.level.maze;
    const rows = maze.height();
    const cols = maze.width();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = maze.tileAt({ x, y });
        if (!tile) continue;
        const img = this.sprites.tiles[tile];
        this.drawImageAt(img, { x, y });
      }
    }
  }

  drawWalls() {
    const maze = this.level.maze;
    maze.forEachHorizontalWall((position, wall) => {
      this.drawHorizontalWall(position, wall);
    });
    maze.forEachVerticalWall((position, wall) => {
      this.drawVerticalWall(position, wall);
    });
  }

  drawHorizontalWall(position: Position, wall: WallType) {
    if (!wall) return;
    const x = position.x * CELL_SIZE;
    const y = (position.y + 0.5) * CELL_SIZE;
    const img = this.sprites.walls[wall].horizontal;
    this.ctx.drawImage(img, x, y, CELL_SIZE, CELL_SIZE);
  }

  drawVerticalWall(position: Position, wall: WallType) {
    if (!wall) return;
    const x = (position.x + 0.5) * CELL_SIZE;
    const y = position.y * CELL_SIZE;
    const img = this.sprites.walls[wall].vertical;
    this.ctx.drawImage(img, x, y, CELL_SIZE, CELL_SIZE);
  }

  drawOwl() {
    const img = this.sprites.owl[this.owl.direction];
    this.drawImageAt(img, this.owl.position);
  }

  drawFinish(position: Position) {
    const img = this.sprites.finish;
    this.drawImageAt(img, position);
  }

  drawImageAt(img: HTMLImageElement, position: Position) {
    this.ctx.drawImage(
      img,
      position.x * CELL_SIZE + (CELL_SIZE - img.width) / 2,
      position.y * CELL_SIZE + (CELL_SIZE - img.height) / 2,
      img.width,
      img.height,
    );
  }
}
