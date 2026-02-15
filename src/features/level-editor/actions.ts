import { createEmptyMazeData, type MazeTheme } from "../../core/game/maze.ts";
import {
  emptyEditorState,
  fromLevelData,
  type LevelEditorState,
} from "./state.ts";
import type { CardinalDirection, Position } from "../../core/interpreter/types.ts";
import type { TileTool, WallTool } from "./tools.tsx";
import type { LevelData } from "../../core/game/level.ts";

export type LevelEditorAction =
  | { type: "setLevel"; level: LevelData }
  | { type: "reset" }
  | { type: "resize"; width: number; height: number }
  | { type: "setMazeTheme"; theme: MazeTheme }
  | { type: "setHorizontalWall"; position: Position; wall: boolean }
  | { type: "setVerticalWall"; position: Position; wall: boolean }
  | { type: "setAllWalls"; wall: boolean }
  | { type: "toggleVisualize" }
  | { type: "setTileTool"; tileTool: TileTool }
  | { type: "setWallTool"; wallTool: WallTool }
  | { type: "setFinish"; position: Position }
  | { type: "setStart"; position: Position; direction: CardinalDirection };

type ActionExecutor<T> = (state: LevelEditorState, args: T) => LevelEditorState;
type ActionExecutors = {
  [K in LevelEditorAction["type"]]: ActionExecutor<
    Extract<LevelEditorAction, { type: K }>
  >;
};

const actionExecutors: ActionExecutors = {
  setLevel: (_, { level }) => {
    return fromLevelData(level);
  },

  reset: (state) => {
    return emptyEditorState(state.level.name);
  },

  resize: (state, { width, height }) => {
    return {
      ...state,
      level: {
        ...state.level,
        maze: createEmptyMazeData(width, height),
      },
    };
  },

  setMazeTheme: (state, { theme }) => {
    state = {
      ...state,
      level: {
        ...state.level,
        maze: {
          ...state.level.maze,
          theme,
        },
      },
    };
    return state;
  },

  setHorizontalWall: (state, { position, wall }) => {
    const horizontal = clone2DArray(state.level.maze.walls.horizontal);
    horizontal[position.y][position.x] = wall;
    state = {
      ...state,
      level: {
        ...state.level,
        maze: {
          ...state.level.maze,
          walls: {
            ...state.level.maze.walls,
            horizontal,
          },
        },
      },
    };
    return state;
  },

  setVerticalWall: (state, { position, wall }) => {
    const vertical = clone2DArray(state.level.maze.walls.vertical);
    vertical[position.y][position.x] = wall;
    state = {
      ...state,
      level: {
        ...state.level,
        maze: {
          ...state.level.maze,
          walls: {
            ...state.level.maze.walls,
            vertical,
          },
        },
      },
    };
    return state;
  },

  setAllWalls: (state, { wall }) => {
    const horizontal = state.level.maze.walls.horizontal.map((row) =>
      row.map(() => wall),
    );
    const vertical = state.level.maze.walls.vertical.map((row) =>
      row.map(() => wall),
    );
    state = {
      ...state,
      level: {
        ...state.level,
        maze: {
          ...state.level.maze,
          walls: {
            horizontal,
            vertical,
          },
        },
      },
    };
    return state;
  },

  toggleVisualize: (state) => {
    return {
      ...state,
      visualize: !state.visualize,
    };
  },

  setTileTool: (state, { tileTool }) => {
    return {
      ...state,
      tileTool,
    };
  },

  setWallTool: (state, { wallTool }) => {
    return {
      ...state,
      wallTool,
    };
  },

  setFinish: (state, { position }) => {
    return {
      ...state,
      level: {
        ...state.level,
        finishPosition: position,
      },
    };
  },

  setStart: (state, { position, direction }) => {
    return {
      ...state,
      level: {
        ...state.level,
        owlStart: {
          position,
          direction,
        },
      },
    };
  },
};

function clone2DArray<T>(array: T[][]): T[][] {
  return array.map((row) => row.slice());
}

export function editorReducer(
  state: LevelEditorState,
  action: LevelEditorAction,
): LevelEditorState {
  const executor = actionExecutors[action.type];
  return executor(state, action as never);
}
