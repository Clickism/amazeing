import { Maze, type WallType } from "./maze";
import type { Owl } from "./owl";
import type { CardinalDirection, Position } from "../interpreter/types";
import type { SpriteMap } from "./sprites";

const OWL_SIZE = 16;
const CELL_SIZE = 32;

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  maze: Maze;
  owl: Owl;
  sprites: SpriteMap;
  dpr: number = window.devicePixelRatio || 1;
  scale: number;

  offsetX: number;
  offsetY: number;

  constructor(
    canvas: HTMLCanvasElement,
    maze: Maze,
    owl: Owl,
    sprites: SpriteMap,
    scale: number = 4,
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas 2D context");
    this.ctx = ctx;
    this.maze = maze;
    this.owl = owl;
    this.sprites = sprites;
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
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.scale(this.scale, this.scale);

    ctx.translate(this.offsetX, this.offsetY);

    this.drawWaterTiles();
    this.drawTiles();
    this.drawWalls();
    this.drawOwl();
    ctx.restore();
  }

  drawWaterTiles() {
    const img = this.sprites.tiles.water;

    const cols = Math.ceil(this.canvas.width / CELL_SIZE);
    const rows = Math.ceil(this.canvas.height / CELL_SIZE);

    const startX = -Math.floor(this.offsetX / CELL_SIZE) - 1;
    const startY = -Math.floor(this.offsetY / CELL_SIZE) - 1;

    const endX = startX + cols + 2;
    const endY = startY + rows + 2;

    for (let y = startY; y < endX; y++) {
      for (let x = startX; x < endY; x++) {
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
