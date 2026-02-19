import type { Translatable } from "../../shared/i18n/i18n.ts";
import type { LevelData } from "../../core/game/level.ts";
import type { MazeData } from "../../core/game/maze.ts";

export type GeneralTool = {
  name: Translatable;
  onClick: (level: LevelData, setLevel: (level: LevelData) => void) => void;
};

export const GENERAL_TOOLS: GeneralTool[] = [
  {
    name: { key: "levelEditor.tools.fillAllWalls" },
    onClick: (level, setLevel) => {
      const maze = setAllWalls(level.maze, true);
      setLevel({
        ...level,
        maze,
      });
    },
  },
  {
    name: { key: "levelEditor.tools.clearAllWalls" },
    onClick: (level, setLevel) => {
      const maze = setAllWalls(level.maze, false);
      setLevel({
        ...level,
        maze,
      });
    },
  },
];

function setAllWalls(maze: MazeData, wall: boolean): MazeData {
  const walls = maze.walls;
  const horizontal = walls.horizontal.map((row) => row.map(() => wall));
  const vertical = walls.vertical.map((row) => row.map(() => wall));
  return {
    ...maze,
    walls: {
      horizontal,
      vertical,
    },
  };
}
