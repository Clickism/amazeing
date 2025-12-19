import { Maze, type WallType } from "./maze";
import type { Owl } from "./owl";
import type { CardinalDirection, Position } from "../interpreter/types";
import type { SpriteMap } from "./sprites";

const OWL_SIZE = 32;
const CELL_SIZE = 32;

export type Camera = {
  position: Position;
  zoom: number;
};

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  maze: Maze;
  owl: Owl;
  sprites: SpriteMap;
  dpr: number = window.devicePixelRatio || 1;
  scale: number;
  camera: Camera;

  offsetX: number;
  offsetY: number;

  constructor(
    canvas: HTMLCanvasElement,
    maze: Maze,
    owl: Owl,
    sprites: SpriteMap,
    camera: Camera,
    scale: number = 4,
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2D context");
    this.ctx = ctx;
    this.maze = maze;
    this.owl = owl;
    this.sprites = sprites;
    this.camera = camera;
    this.scale = scale;

    const mazeWidth = this.maze.width() * CELL_SIZE;
    const mazeHeight = this.maze.height() * CELL_SIZE;

    const canvasWidth = this.canvas.width / (this.dpr * this.scale);
    const canvasHeight = this.canvas.height / (this.dpr * this.scale);

    this.offsetX = (canvasWidth - mazeWidth) / 2;
    this.offsetY = (canvasHeight - mazeHeight) / 2;
  }

  render() {
    const ctx = this.ctx;

    ctx.save();

    // Reset
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Scale
    ctx.scale(this.scale * this.dpr, this.scale * this.dpr);

    // Center
    ctx.translate(this.offsetX, this.offsetY);

    // Camera
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.position.x, -this.camera.position.y);

    ctx.imageSmoothingEnabled = false;

    this.drawWaterTiles();
    this.drawTiles();
    this.drawWalls();
    this.drawOwl();
    ctx.restore();
  }

  drawWaterTiles() {
    const img = this.sprites.tiles.water;

    const viewWidth =
      this.canvas.width / (this.scale * this.dpr * this.camera.zoom);
    const viewHeight =
      this.canvas.height / (this.scale * this.dpr * this.camera.zoom);

    const left = this.camera.position.x - this.offsetX;
    const top = this.camera.position.y - this.offsetY;

    const right = left + viewWidth;
    const bottom = top + viewHeight;

    const startX = Math.floor(left / CELL_SIZE) - 20;
    const startY = Math.floor(top / CELL_SIZE) - 20;
    const endX = Math.ceil(right / CELL_SIZE) + 20;
    const endY = Math.ceil(bottom / CELL_SIZE) + 20;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.ctx.drawImage(
          img,
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
        );
      }
    }
  }


  drawTiles() {
    const rows = this.maze.height();
    const cols = this.maze.width();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = this.maze.tileAt({ x, y });
        if (!tile) continue;
        const img = this.sprites.tiles[tile];
        this.ctx.drawImage(
          img,
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
        );
      }
    }
  }

  drawWalls() {
    this.maze.forEachWall((position, direction, wall) => {
      this.drawWallImage(position, direction, wall);
    });
  }

  drawWallImage(
    position: Position,
    direction: CardinalDirection,
    wall: WallType,
  ) {
    if (!wall) return;
    const offset = CELL_SIZE / 2;
    const x = position.x * CELL_SIZE;
    const y = position.y * CELL_SIZE;
    const img = this.sprites.walls[wall];
    if (direction === "north" || direction === "south") {
      this.ctx.drawImage(
        img.horizontal,
        x,
        direction === "north" ? y - offset : y + offset,
        CELL_SIZE,
        CELL_SIZE,
      );
    } else {
      this.ctx.drawImage(
        img.vertical,
        direction === "west" ? x - offset : x + offset,
        y,
        CELL_SIZE,
        CELL_SIZE,
      );
    }
  }

  drawOwl() {
    const img = this.sprites.owl[this.owl.direction];
    this.ctx.drawImage(
      img,
      this.owl.position.x * CELL_SIZE + (CELL_SIZE - OWL_SIZE) / 2,
      this.owl.position.y * CELL_SIZE + (CELL_SIZE - OWL_SIZE) / 2,
      OWL_SIZE,
      OWL_SIZE,
    );
  }
}
