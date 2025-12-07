export type ValueType = "integer";
export type Value = Integer;

export type Position = { x: number; y: number };

export type Direction = LeftRight | CardinalDirection;
export type LeftRight = "left" | "right";
export type CardinalDirection = "north" | "east" | "south" | "west";

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
