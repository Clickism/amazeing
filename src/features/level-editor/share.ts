import type { LevelData } from "../../core/game/level.ts";
import type { Position } from "../../core/interpreter/types.ts";

export function encodeQuickCode(level: LevelData) {}

export function decodeQuickCode(code: LevelData) {}

type Encoder<T> = {
  encode: (data: T) => string;
  decode: (code: string) => T;
};

const positionEncoder: Encoder<Position> = {
  encode: ({ x, y }) => {
    return `(${x},${y})`;
  },
  decode: (code) => {
    let [xp, yp] = code.split(",");
    xp = xp.substring(1);
    yp = yp.substring(0, yp.length - 1);
    const x = parseInt(xp);
    const y = parseInt(yp);
    return { x, y };
  },
};
