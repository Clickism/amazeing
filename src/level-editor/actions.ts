import { type TileType, type WallType } from "../game/maze.ts";
import {
  createEditorState,
  createInitialEditorState,
  type EditorState,
} from "./state.ts";

type EditorAction =
  | { type: "reset" }
  | { type: "resize"; width: number; height: number }
  | { type: "setTile"; row: number; col: number; tile: TileType }
  | { type: "setHorizontalWall"; row: number; col: number; wall: WallType }
  | { type: "setVerticalWall"; row: number; col: number; wall: WallType }
  | { type: "setAllTiles"; tile: TileType }
  | { type: "setAllWalls"; wall: WallType };

type ActionExecutor<T> = (state: EditorState, args: T) => EditorState;
type ActionExecutors = {
  [K in EditorAction["type"]]: ActionExecutor<
    Extract<EditorAction, { type: K }>
  >;
};

const actionExecutors: ActionExecutors = {
  reset: () => {
    return createInitialEditorState();
  },

  resize: (state, { width, height }) => {
    return {
      ...createEditorState(width, height),
      name: state.name,
      description: state.description,
    };
  },

  setTile: (state, { row, col, tile }) => {
    const tiles = clone2DArray(state.maze.tiles);
    tiles[row][col] = tile;
    state = {
      ...state,
      maze: {
        ...state.maze,
        tiles,
      },
    };
    return state;
  },

  setHorizontalWall: (state, { row, col, wall }) => {
    const horizontal = clone2DArray(state.maze.walls.horizontal);
    horizontal[row][col] = wall;
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

  setVerticalWall: (state, { row, col, wall }) => {
    const vertical = clone2DArray(state.maze.walls.vertical);
    vertical[row][col] = wall;
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

  setAllTiles: (state, { tile }) => {
    const tiles = state.maze.tiles.map((row) => row.map(() => tile));
    state = {
      ...state,
      maze: {
        ...state.maze,
        tiles,
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
};

function clone2DArray<T>(array: T[][]): T[][] {
  return array.map((row) => row.slice());
}

export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  const executor = actionExecutors[action.type];
  return executor(state, action as never);
}
