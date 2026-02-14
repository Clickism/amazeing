import type { Translatable } from "../i18n/i18n.ts";
import { CARDINAL_DIRECTIONS, type Position } from "../interpreter/types.ts";
import type { ReactNode } from "react";
import type { LevelEditorDispatch, LevelEditorState } from "./state.ts";
import { ButtonGroup } from "../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../components/Button/Button.tsx";
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
};

export type WallTool = BaseTool & {
  onWallClick: (
    editor: LevelEditorState,
    dispatch: LevelEditorDispatch,
    position: Position,
    horizontal: boolean,
  ) => void;
};

export type GeneralTool = BaseTool & {
  onClick: (editor: LevelEditorState, dispatch: LevelEditorDispatch) => void;
};

export const TILE_TOOLS: TileTool[] = [
  {
    name: "Start/Finish",
    onTileClick: () => {},
    tilePopup: (_, dispatch, position) => (
      <ButtonGroup vertical stretch>
        <h6>Place Start</h6>
        <ButtonGroup>
          {CARDINAL_DIRECTIONS.map((direction) => (
            <Button
              key={direction}
              variant="outlined"
              onClick={() => {
                dispatch({
                  type: "setStart",
                  position,
                  direction,
                });
              }}
            >
              {getDirectionIcon(direction, { size: 22 })}
            </Button>
          ))}
        </ButtonGroup>
        <h6>Place Finish</h6>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch({
              type: "setFinish",
              position,
            });
          }}
        >
          Place Finish
        </Button>
      </ButtonGroup>
    ),
  },
  {
    name: { key: "levelEditor.tools.start" },
    onTileClick: (editor, dispatch, position) => {
      dispatch({
        type: "setStart",
        position,
        direction: editor.level.owlStart.direction,
      });
    },
    tilePopup: (_, dispatch, position) => (
      <div>
        <ButtonGroup>
          {CARDINAL_DIRECTIONS.map((direction) => (
            <Button
              key={direction}
              variant="outlined"
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

export const WALL_TOOLS: WallTool[] = [
  {
    name: { key: "wall" },
    onWallClick: (editor, dispatch, position, horizontal) => {
      const currentWall = horizontal
        ? editor.level.maze.walls.horizontal[position.y][position.x]
        : editor.level.maze.walls.vertical[position.y][position.x];
      const newWall = !currentWall;
      if (horizontal) {
        dispatch({ type: "setHorizontalWall", position, wall: newWall });
      } else {
        dispatch({ type: "setVerticalWall", position, wall: newWall });
      }
    },
  },
];

export const GENERAL_TOOLS: GeneralTool[] = [
  {
    name: { key: "levelEditor.tools.fillAllWalls" },
    onClick: (_, dispatch) => {
      dispatch({ type: "setAllWalls", wall: true });
    },
  },
  {
    name: { key: "levelEditor.tools.clearAllWalls" },
    onClick: (_, dispatch) => {
      dispatch({ type: "setAllWalls", wall: false });
    },
  },
];
