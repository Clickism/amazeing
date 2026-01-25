import styles from "./TileGrid.module.css";
import { Fragment } from "react";
import { Tile } from "../Tile/Tile.tsx";
import { Wall } from "../Wall/Wall.tsx";
import clsx from "clsx";
import type { LevelEditorDispatch, LevelEditorState } from "../../../state.ts";
import type { Position } from "../../../../interpreter/types.ts";
import { Popover } from "../../../../components/floating/Popover/Popover.tsx";

type TileGridProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

export function TileGrid({ editor, dispatch }: TileGridProps) {
  const maze = editor.maze;
  const onTileClick = (position: Position) => {
    editor.tileTool.onTileClick(editor, dispatch, position);
  };
  const onWallClick = (position: Position, horizontal: boolean) => {
    editor.wallTool.onWallClick(editor, dispatch, position, horizontal);
  };
  const rows = Array.from({ length: maze.height });
  const columns = Array.from({ length: maze.width });
  return (
    <div className={styles.grid}>
      {rows.map((_, row) => (
        <Fragment key={row}>
          <div className={styles.gridRow}>
            {columns.map((_, col) => (
              <Fragment key={col}>
                {/*Tiles*/}
                {editor.tileTool.tilePopup ? (
                  <Popover
                    onOpen={() => {
                      onTileClick({ x: col, y: row });
                    }}
                    trigger={
                      <Tile
                        tile={maze.tileType}
                        editor={editor}
                        position={{ x: col, y: row }}
                      />
                    }
                  >
                    {editor.tileTool.tilePopup(editor, dispatch, {
                      x: col,
                      y: row,
                    })}
                  </Popover>
                ) : (
                  <Tile
                    tile={maze.tileType}
                    editor={editor}
                    position={{ x: col, y: row }}
                    onClick={() => onTileClick({ x: col, y: row })}
                  />
                )}

                {/*Horizontal Walls*/}
                {col < editor.width - 1 && (
                  <Wall
                    wall={maze.walls.vertical[row][col]}
                    editor={editor}
                    onClick={() => onWallClick({ x: col, y: row }, false)}
                  />
                )}
              </Fragment>
            ))}
          </div>

          {/*Vertical Walls*/}
          {row < editor.height - 1 && (
            <div className={clsx(styles.gridRow, styles.wallRow)}>
              {columns.map((_, col) => (
                <Wall
                  key={col}
                  wall={maze.walls.horizontal[row][col]}
                  editor={editor}
                  horizontal
                  onClick={() => onWallClick({ x: col, y: row }, true)}
                />
              ))}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
