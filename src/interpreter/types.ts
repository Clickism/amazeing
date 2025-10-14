export type Value = number;

export type Position = { x: number; y: number };

export type Direction = LeftRight | CardinalDirection;
export type LeftRight = "left" | "right";
export type CardinalDirection = "north" | "east" | "south" | "west";
