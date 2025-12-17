export type ValueType = "integer";
export type Value = Integer;

export type Position = { x: number; y: number };

export type Direction = RelativeDirection | CardinalDirection;
export type CardinalDirection = "north" | "east" | "south" | "west";
export type RelativeDirection = LeftRight | "front" | "back" | "here";
export type LeftRight = "left" | "right";

export type Integer = number;

export type Address = Variable | ArrayAccess;

export type Variable = string;

export type ArrayAccess = {
  array: Variable;
  index: ArrayIndex;
};
export type Array = (Value | null)[];
export type ArrayIndex = Variable | Integer;

export function isArrayAccess(address: Address): address is ArrayAccess {
  return typeof address !== "string";
}

export const CARDINAL_DIRECTIONS: CardinalDirection[] = [
  "north",
  "east",
  "south",
  "west",
];

export function oppositeDirection(
  direction: CardinalDirection,
): CardinalDirection {
  switch (direction) {
    case "north":
      return "south";
    case "south":
      return "north";
    case "east":
      return "west";
    case "west":
      return "east";
  }
}

export function inDirection(position: Position, direction: CardinalDirection) {
  const { x, y } = position;
  switch (direction) {
    case "north":
      return { x, y: y - 1 };
    case "south":
      return { x, y: y + 1 };
    case "east":
      return { x: x + 1, y };
    case "west":
      return { x: x - 1, y };
  }
}

export function booleanToInteger(value: boolean): Integer {
  return value ? 1 : 0;
}
