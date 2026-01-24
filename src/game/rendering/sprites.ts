import type { TileType, WallType } from "../maze.ts";
import type { CardinalDirection } from "../../interpreter/types.ts";

import grass from "../../assets/sprites/game/tilesets/grass.png";
import water from "../../assets/sprites/game/tiles/water.png";
import wallStoneVertical from "../../assets/sprites/game/walls/stone_vertical.png";
import wallStoneHorizontal from "../../assets/sprites/game/walls/stone_horizontal.png";

import owlNorth from "../../assets/sprites/game/owl/north.png";
import owlSouth from "../../assets/sprites/game/owl/south.png";
import owlEast from "../../assets/sprites/game/owl/east.png";
import owlWest from "../../assets/sprites/game/owl/west.png";

import finish from "../../assets/sprites/game/finish.png";

export type SpriteMap = {
  tilesets: Record<Exclude<TileType, null>, HTMLImageElement>;
  walls: {
    [key in Exclude<WallType, null>]: {
      horizontal: HTMLImageElement;
      vertical: HTMLImageElement;
    };
  };
  water: HTMLImageElement;
  owl: Record<CardinalDirection, HTMLImageElement>;
  finish: HTMLImageElement;
};

export async function loadSprites(): Promise<SpriteMap> {
  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.style.imageRendering = "pixelated";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

  return {
    tilesets: {
      grass: await load(grass),
    },
    walls: {
      stone: {
        horizontal: await load(wallStoneHorizontal),
        vertical: await load(wallStoneVertical),
      },
    },
    water: await load(water),
    owl: {
      north: await load(owlNorth),
      south: await load(owlSouth),
      east: await load(owlEast),
      west: await load(owlWest),
    },
    finish: await load(finish),
  };
}
