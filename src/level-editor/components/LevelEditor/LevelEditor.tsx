import { Fragment, useReducer, useState } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { Button } from "../../../components/ui/Button/Button.tsx";
import { FormGroup } from "../../../components/ui/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../components/ui/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../components/ui/Button/ButtonGroup/ButtonGroup.tsx";
import {
  TILE_TYPES,
  type TileType,
  WALL_TYPES,
  type WallType,
} from "../../../game/maze.ts";
import { titleCase } from "../../../utils/utils.ts";
import { editorReducer } from "../../actions.ts";
import { createEditorState } from "../../state.ts";
import { Wall } from "./Wall/Wall.tsx";
import { Tile } from "./Tile/Tile.tsx";

export function LevelEditor() {
  const [editor, dispatch] = useReducer(
    editorReducer,
    createEditorState(10, 10),
  );

  const [selectedTile, setSelectedTile] = useState<TileType>("grass");
  const [selectedWall, setSelectedWall] = useState<WallType>("stone");

  const maze = editor.maze;

  const MAX_SIZE = 50;

  return (
    <div className={styles.levelEditor}>
      <div className={clsx(styles.panel, "window-border")}>
        <h4>Level Editor 🎨</h4>
        <h5>Maze Size</h5>
        <FormGroup horizontal stretch>
          <FormField label="Width">
            <input
              type="number"
              value={editor.width}
              min={2}
              max={MAX_SIZE}
              onChange={(e) => {
                const width = Number(e.target.value);
                dispatch({
                  type: "resize",
                  width: width,
                  height: editor.height,
                });
              }}
            />
          </FormField>
          <FormField label="Height">
            <input
              type="number"
              value={editor.height}
              min={2}
              max={MAX_SIZE}
              onChange={(e) => {
                const height = Number(e.target.value);
                dispatch({
                  type: "resize",
                  width: editor.width,
                  height: height,
                });
              }}
            />
          </FormField>
        </FormGroup>

        <h5>Tile Type</h5>

        <ButtonGroup vertical stretch>
          {TILE_TYPES.map((tile) => (
            <Button
              key={tile}
              variant={selectedTile === tile ? "secondary" : "outlined"}
              onClick={() => setSelectedTile(tile)}
            >
              {titleCase(tile ?? "Empty")}
            </Button>
          ))}
        </ButtonGroup>

        <h5>Wall Type</h5>

        <ButtonGroup vertical stretch>
          {WALL_TYPES.map((wall) => (
            <Button
              key={wall}
              variant={selectedWall === wall ? "secondary" : "outlined"}
              onClick={() => setSelectedWall(wall)}
            >
              {titleCase(wall ?? "Empty")}
            </Button>
          ))}
        </ButtonGroup>

        <h5>Tools</h5>

        <ButtonGroup vertical stretch>
          <Button
            onClick={() => {
              dispatch({ type: "setAllTiles", tile: selectedTile });
            }}
          >
            Fill All Tiles
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "setAllTiles", tile: null });
            }}
          >
            Clear All Tiles
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "setAllWalls", wall: selectedWall });
            }}
          >
            Fill All Walls
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "setAllWalls", wall: null });
            }}
          >
            Clear All Walls
          </Button>
        </ButtonGroup>

        <h5>Actions</h5>

        <ButtonGroup vertical stretch>
          <Button variant="primary">Export JSON</Button>
          <Button
            variant="danger"
            onClick={() => {
              dispatch({ type: "reset" });
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </div>

      <div className={clsx(styles.gridWindow, "window-border")}>
        <div className={clsx(styles.gridContainer)}>
          <div className={styles.grid}>
            {maze.tiles.map((columns, row) => (
              <Fragment key={row}>
                <div className={styles.gridRow}>
                  {columns.map((_, col) => (
                    <Fragment key={col}>
                      <Tile
                        tile={maze.tiles[row][col]}
                        editor={editor}
                        position={{ x: row, y: col }}
                        onClick={() => {
                          const currentTile = maze.tiles[row][col];
                          const tile =
                            currentTile === selectedTile ? null : selectedTile;
                          dispatch({ type: "setTile", row, col, tile });
                        }}
                      />
                      {col < editor.width - 1 && (
                        <Wall
                          wall={maze.walls.vertical[row][col]}
                          onClick={() => {
                            const currentWall = maze.walls.vertical[row][col];
                            const wall =
                              currentWall === selectedWall
                                ? null
                                : selectedWall;
                            dispatch({
                              type: "setVerticalWall",
                              row,
                              col,
                              wall,
                            });
                          }}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>
                {row < editor.height - 1 && (
                  <div className={clsx(styles.gridRow, styles.wallRow)}>
                    {columns.map((_, ci) => (
                      <Wall
                        key={ci}
                        wall={maze.walls.horizontal[row][ci]}
                        horizontal
                        onClick={() => {
                          const currentWall = maze.walls.horizontal[row][ci];
                          const wall =
                            currentWall === selectedWall ? null : selectedWall;
                          dispatch({
                            type: "setHorizontalWall",
                            row,
                            col: ci,
                            wall,
                          });
                        }}
                      />
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
