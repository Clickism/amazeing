import type { TileType, WallType } from "./maze.ts";
import type { CardinalDirection } from "../interpreter/types.ts";

import grass from "../assets/sprites/game/tiles/grass.png";
import stone from "../assets/sprites/game/walls/stone.png";

import owlNorth from "../assets/sprites/game/owl/north.png";
import owlSouth from "../assets/sprites/game/owl/south.png";
import owlEast from "../assets/sprites/game/owl/east.png";
import owlWest from "../assets/sprites/game/owl/west.png";

export type SpriteMap = {
  tiles: Record<TileType, HTMLImageElement>;
  walls: Record<Exclude<WallType, null>, HTMLImageElement>;
  owl: Record<CardinalDirection, HTMLImageElement>;
};

export async function loadSprites(): Promise<SpriteMap> {
  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

  return {
    tiles: {
      grass: await load(grass),
    },
    walls: {
      stone: await load(stone),
    },
    owl: {
      north: await load(owlNorth),
      south: await load(owlSouth),
      east: await load(owlEast),
      west: await load(owlWest),
    },
  };
}
