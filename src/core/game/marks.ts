import type { CardinalDirection, Position } from "../interpreter/types.ts";

export type MarkData = {
  marks: number[][];
};

export class Marks {
  data: () => MarkData;
  setData: (data: MarkData) => void;

  constructor(data: () => MarkData, setData: (data: MarkData) => void) {
    this.data = data;
    this.setData = setData;
  }

  mark(position: Position, direction: CardinalDirection | "here") {
    this.markInternal(position, direction, true);
  }

  unmark(position: Position, direction: CardinalDirection | "here") {
    this.markInternal(position, direction, false);
  }

  private markInternal(
    position: Position,
    direction: CardinalDirection | "here",
    mark: boolean,
  ) {
    let mask;
    switch (direction) {
      case "west":
        mask = 1;
        break;
      case "south":
        mask = 1 << 1;
        break;
      case "east":
        mask = 1 << 2;
        break;
      case "north":
        mask = 1 << 3;
        break;
      case "here":
        mask = 15;
        break;
    }
    const currentMark = this.getMarkAt(position) || 0;
    if (mark) {
      this.setMarkAt(position, currentMark | mask);
    } else {
      this.setMarkAt(position, currentMark & ~mask);
    }
  }

  getMarkAt(position: Position) {
    return this.data().marks[position.y][position.x];
  }

  setMarkAt(position: Position, value: number) {
    const marks = this.data().marks;
    const newMarks = marks.map((row) => row.map((mark) => mark));
    newMarks[position.y][position.x] = value;
    this.setData({ marks: newMarks });
  }
}

export function emptyMarks(width: number, height: number): MarkData {
  const marks = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(0);
    }
    marks.push(row);
  }
  return { marks };
}
