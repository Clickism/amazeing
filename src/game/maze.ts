export type Maze = {
  tiles: Tile[][];
};

export type Tile = {
  walls: Walls;
  type: TileType;
};

export type Walls = {
  north: WallType;
  south: WallType;
  east: WallType;
  west: WallType;
};

export type TileType = "grass" //| "dirt" | "sand" | "water";

export type WallType = "stone" | null; //"brick" | "stone" | "hedge" | null;

