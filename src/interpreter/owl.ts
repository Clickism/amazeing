import type { Direction, Position } from "./types.ts";

/**
 * Represents the owl in the map.
 */
export class Owl {
  position: Position;
  direction: Direction;

  constructor(position: Position, direction: Direction) {
    this.position = position;
    this.direction = direction;
  }

  move() {}
}
