import { type WallType } from "../game/maze.ts";
import {
  createEditorState,
  createInitialEditorState,
  type LevelEditorState,
} from "./state.ts";
import type { CardinalDirection, Position } from "../interpreter/types.ts";
import type { TileTool, WallTool } from "./tools.tsx";

export type LevelEditorAction =
  | { type: "reset" }
  | { type: "resize"; width: number; height: number }
  | { type: "setHorizontalWall"; position: Position; wall: WallType }
  | { type: "setVerticalWall"; position: Position; wall: WallType }
  | { type: "setAllWalls"; wall: WallType }
  | { type: "setMetadata"; name: string; description: string }
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
  reset: () => {
    return createInitialEditorState();
  },

  resize: (state, { width, height }) => {
    const newState = createEditorState(width, height);
    return {
      ...state,
      width: newState.width,
      height: newState.height,
      maze: newState.maze,
      finishPosition: newState.finishPosition,
      owlStart: newState.owlStart,
    };
  },

  setHorizontalWall: (state, { position, wall }) => {
    const horizontal = clone2DArray(state.maze.walls.horizontal);
    horizontal[position.y][position.x] = wall;
    state = {
      ...state,
      maze: {
        ...state.maze,
        walls: {
          ...state.maze.walls,
          horizontal,
        },
      },
    };
    return state;
  },

  setVerticalWall: (state, { position, wall }) => {
    const vertical = clone2DArray(state.maze.walls.vertical);
    vertical[position.y][position.x] = wall;
    state = {
      ...state,
      maze: {
        ...state.maze,
        walls: {
          ...state.maze.walls,
          vertical,
        },
      },
    };
    return state;
  },

  setAllWalls: (state, { wall }) => {
    const horizontal = state.maze.walls.horizontal.map((row) =>
      row.map(() => wall),
    );
    const vertical = state.maze.walls.vertical.map((row) =>
      row.map(() => wall),
    );
    state = {
      ...state,
      maze: {
        ...state.maze,
        walls: {
          horizontal,
          vertical,
        },
      },
    };
    return state;
  },

  setMetadata: (state, { name, description }) => {
    state = {
      ...state,
      name,
      description,
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
      finishPosition: position,
    };
  },

  setStart: (state, { position, direction }) => {
    return {
      ...state,
      owlStart: {
        position,
        direction,
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
