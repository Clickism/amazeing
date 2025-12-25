import type { Translatable } from "../i18n/i18n.ts";
import { CARDINAL_DIRECTIONS, type Position } from "../interpreter/types.ts";
import type { ReactNode } from "react";
import type { LevelEditorDispatch, LevelEditorState } from "./state.ts";
import {
  TILE_TYPES,
  type TileType,
  WALL_TYPES,
  type WallType,
} from "../game/maze.ts";
import { ButtonGroup } from "../components/ui/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../components/ui/Button/Button.tsx";
import { getDirectionIcon } from "./utils.tsx";

export type BaseTool = {
  name: Translatable;
};

export type TileTool = BaseTool & {
  onTileClick: (
    editor: LevelEditorState,
    dispatch: LevelEditorDispatch,
    position: Position,
  ) => void;
  tilePopup?: (
    editor: LevelEditorState,
    dispatch: LevelEditorDispatch,
    position: Position,
  ) => ReactNode;
  tileType?: TileType;
};

export type WallTool = BaseTool & {
  onWallClick: (
    editor: LevelEditorState,
    dispatch: LevelEditorDispatch,
    position: Position,
    horizontal: boolean,
  ) => void;
  wallType?: WallType;
};

export type GeneralTool = BaseTool & {
  onClick: (editor: LevelEditorState, dispatch: LevelEditorDispatch) => void;
};

export const TILE_TOOLS: TileTool[] = [
  ...TILE_TYPES.filter((t) => t != "water").map(
    (tile) =>
      ({
        name: { key: `tile.${tile}` },
        onTileClick: (editor, dispatch, position) => {
          const currentTile = editor.maze.tiles[position.y][position.x];
          const newTile = currentTile === tile ? null : tile;
          dispatch({ type: "setTile", position, tile: newTile });
        },
        tileType: tile,
      }) as TileTool,
  ),
  {
    name: { key: "levelEditor.tools.start" },
    onTileClick: (editor, dispatch, position) => {
      dispatch({
        type: "setStart",
        position,
        direction: editor.owlStart.direction,
      });
    },
    tilePopup: (_, dispatch, position) => (
      <div>
        <ButtonGroup>
          {CARDINAL_DIRECTIONS.map((direction) => (
            <Button
              onClick={() => {
                dispatch({
                  type: "setStart",
                  position,
                  direction,
                });
              }}
            >
              {getDirectionIcon(direction, { size: 24 })}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    ),
  },
  {
    name: { key: "levelEditor.tools.finish" },
    onTileClick: (_, dispatch: LevelEditorDispatch, position: Position) => {
      dispatch({ type: "setFinish", position });
    },
  },
];

export const WALL_TOOLS = [
  ...WALL_TYPES.map(
    (wall) =>
      ({
        name: { key: `wall.${wall}` },
        onWallClick: (editor, dispatch, position, horizontal) => {
          const currentWall = horizontal
            ? editor.maze.walls.horizontal[position.y][position.x]
            : editor.maze.walls.vertical[position.y][position.x];
          const newWall = currentWall === wall ? null : wall;
          if (horizontal) {
            dispatch({ type: "setHorizontalWall", position, wall: newWall });
          } else {
            dispatch({ type: "setVerticalWall", position, wall: newWall });
          }
        },
        wallType: wall,
      }) as WallTool,
  ),
];

export const GENERAL_TOOLS: GeneralTool[] = [
  {
    name: { key: "levelEditor.tools.fillAllTiles" },
    onClick: (editor, dispatch) => {
      const selectedTile = editor.tileTool.tileType ?? null;
      dispatch({ type: "setAllTiles", tile: selectedTile });
    },
  },
  {
    name: { key: "levelEditor.tools.clearAllTiles" },
    onClick: (_, dispatch) => {
      dispatch({ type: "setAllTiles", tile: null });
    },
  },
  {
    name: { key: "levelEditor.tools.fillAllWalls" },
    onClick: (editor, dispatch) => {
      const selectedWall = editor.wallTool.wallType ?? null;
      dispatch({ type: "setAllWalls", wall: selectedWall });
    },
  },
  {
    name: { key: "levelEditor.tools.clearAllWalls" },
    onClick: (_, dispatch) => {
      dispatch({ type: "setAllWalls", wall: null });
    },
  },
];
