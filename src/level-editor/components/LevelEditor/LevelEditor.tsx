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
import { editorReducer, stringifyEditorState } from "../../actions.ts";
import { createInitialEditorState } from "../../state.ts";
import { Wall } from "./Wall/Wall.tsx";
import { Tile } from "./Tile/Tile.tsx";
import { Viewport } from "../../../components/Viewport/Viewport.tsx";
import { Level } from "../../../game/level.ts";
import { OwlImpl } from "../../../game/owl.ts";
import { Modal } from "../../../components/ui/Modal/Modal.tsx";

export function LevelEditor() {
  const [editor, dispatch] = useReducer(
    editorReducer,
    createInitialEditorState(),
  );

  const [selectedTile, setSelectedTile] = useState<TileType>("grass");
  const [selectedWall, setSelectedWall] = useState<WallType>("stone");

  const [visualize, setVisualize] = useState(false);

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
      </div>

      <div className={clsx(styles.gridWindow, "window-border")}>
        {visualize ? (
          <Viewport
            owl={
              new OwlImpl(
                editor.owlStart.position,
                editor.owlStart.direction,
                () => {},
              )
            }
            level={new Level(editor)}
          />
        ) : (
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
                          position={{ x: col, y: row }}
                          onClick={() => {
                            const currentTile = maze.tiles[row][col];
                            const tile =
                              currentTile === selectedTile
                                ? null
                                : selectedTile;
                            dispatch({ type: "setTile", row, col, tile });
                          }}
                        />
                        {col < editor.width - 1 && (
                          <Wall
                            wall={maze.walls.vertical[row][col]}
                            editor={editor}
                            position={{ x: col, y: row }}
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
                      {columns.map((_, col) => (
                        <Wall
                          key={col}
                          wall={maze.walls.horizontal[row][col]}
                          editor={editor}
                          position={{ x: col, y: row }}
                          horizontal
                          onClick={() => {
                            const currentWall = maze.walls.horizontal[row][col];
                            const wall =
                              currentWall === selectedWall
                                ? null
                                : selectedWall;
                            dispatch({
                              type: "setHorizontalWall",
                              row,
                              col: col,
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
        )}
      </div>

      <div className={clsx(styles.panel, "window-border")}>
        <h4>Export 📤</h4>
        <h5>Metadata</h5>
        <FormGroup stretch>
          <FormField label="Level Name">
            <input
              type="text"
              value={editor.name}
              onChange={(e) => {
                dispatch({
                  type: "setMetadata",
                  name: e.target.value,
                  description: editor.description,
                });
              }}
            />
          </FormField>
          <FormField label="Level Description">
            <textarea
              value={editor.description}
              onChange={(e) => {
                dispatch({
                  type: "setMetadata",
                  name: editor.name,
                  description: e.target.value,
                });
              }}
            />
          </FormField>
        </FormGroup>

        <h5>Actions</h5>

        <ButtonGroup vertical stretch>
          <Button variant="success" onClick={() => setVisualize((p) => !p)}>
            {visualize ? "Edit Maze" : "Visualize Maze"}
          </Button>
          <Modal trigger={<Button variant="primary">Export JSON</Button>}>
            <h5>Exported Level JSON</h5>
            <textarea
              readOnly
              value={stringifyEditorState(editor)}
              style={{
                height: "200px",
              }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(stringifyEditorState(editor));
              }}
            >
              Copy to Clipboard
            </Button>
          </Modal>

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
    </div>
  );
}
