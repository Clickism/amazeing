import type { VariableValue } from "./environment.ts";

export type Value = Integer | Direction;

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

export function isPositionEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isDirection(value: unknown): value is Direction {
  return (
    value === "north" ||
    value === "east" ||
    value === "south" ||
    value === "west" ||
    value === "left" ||
    value === "right" ||
    value === "front" ||
    value === "back" ||
    value === "here"
  );
}

export function isInteger(value: unknown): value is Integer {
  return typeof value === "number";
}

export function isValue(value: unknown): value is Value {
  return isInteger(value) || isDirection(value as Value);
}

export function typeOfValue(value: VariableValue): string {
  if (isInteger(value)) {
    return "integer";
  } else {
    return "direction";
  }
}

export function typeOfVariableValue(value: VariableValue): string {
  if (isValue(value)) {
    return typeOfValue(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "array[unknown]";
    }
    const elementType = typeOfVariableValue(value[0]);
    return `array[${elementType}]`;
  }
  throw new Error(`Unknown variable value type: ${value}`);
}

export function hasSameType(a: Value, b: Value): boolean {
  return typeOfValue(a) === typeOfValue(b);
}
