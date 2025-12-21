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
import { CopyToClipboard } from "../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";

type TileBrush = { type: "tile"; tile: TileType } | { type: "startFinish" };

export function LevelEditor() {
  const { t } = useTranslation();

  const [editor, dispatch] = useReducer(
    editorReducer,
    createInitialEditorState(),
  );

  const [tileBrush, setTileBrush] = useState<TileBrush>({
    type: "tile",
    tile: "grass",
  });
  const [wallBrush, setWallBrush] = useState<WallType>("stone");

  const [visualize, setVisualize] = useState(false);

  const maze = editor.maze;

  const MAX_SIZE = 50;
  const selectedTile = tileBrush.type === "tile" ? tileBrush.tile : null;
  return (
    <div className={styles.levelEditor}>
      <div className={clsx(styles.panel, "window-border")}>
        <h4>{t("levelEditor.title") + " 🎨"}</h4>

        <h5>{t("levelEditor.headers.mazeSize")}</h5>
        <FormGroup horizontal stretch>
          <FormField label={t("levelEditor.tools.width")}>
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
          <FormField label={t("levelEditor.tools.height")}>
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

        <h5>{t("levelEditor.headers.tileBrush")}</h5>

        <ButtonGroup vertical stretch>
          {TILE_TYPES.map((tile) => (
            <Button
              key={tile}
              variant={selectedTile === tile ? "secondary" : "outlined"}
              onClick={() => setTileBrush({ type: "tile", tile })}
            >
              {titleCase(tile ?? "Empty")}
            </Button>
          ))}
          <Button
            onClick={() => setTileBrush({ type: "startFinish" })}
            variant={
              tileBrush.type === "startFinish" ? "secondary" : "outlined"
            }
          >
            {t("levelEditor.tools.startFinish")}
          </Button>
        </ButtonGroup>

        <h5>{t("levelEditor.headers.wallBrush")}</h5>

        <ButtonGroup vertical stretch>
          {WALL_TYPES.map((wall) => (
            <Button
              key={wall}
              variant={wallBrush === wall ? "secondary" : "outlined"}
              onClick={() => setWallBrush(wall)}
            >
              {titleCase(wall ?? "Empty")}
            </Button>
          ))}
        </ButtonGroup>

        <h5>{t("levelEditor.headers.tools")}</h5>

        <ButtonGroup vertical stretch>
          <Button
            onClick={() => {
              dispatch({ type: "setAllTiles", tile: selectedTile });
            }}
          >
            {t("levelEditor.tools.fillAllTiles")}
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "setAllTiles", tile: null });
            }}
          >
            {t("levelEditor.tools.clearAllTiles")}
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "setAllWalls", wall: wallBrush });
            }}
          >
            {t("levelEditor.tools.fillAllWalls")}
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: "setAllWalls", wall: null });
            }}
          >
            {t("levelEditor.tools.clearAllWalls")}
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
                                currentWall === wallBrush ? null : wallBrush;
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
                              currentWall === wallBrush ? null : wallBrush;
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
        <h4>{t("levelEditor.export.export") + " 📤"}</h4>
        <h5>{t("levelEditor.headers.metadata")}</h5>
        <FormGroup stretch>
          <FormField label={t("levelEditor.export.levelName")}>
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
              style={{
                width: "200px",
              }}
            />
          </FormField>
          <FormField label={t("levelEditor.export.levelDescription")}>
            <textarea
              value={editor.description}
              onChange={(e) => {
                dispatch({
                  type: "setMetadata",
                  name: editor.name,
                  description: e.target.value,
                });
              }}
              style={{
                height: "100px",
                width: "200px",
              }}
            />
          </FormField>
        </FormGroup>

        <h5>{t("levelEditor.headers.actions")}</h5>

        <ButtonGroup vertical stretch>
          <Button variant="success" onClick={() => setVisualize((p) => !p)}>
            {visualize
              ? t("levelEditor.export.actions.editMaze")
              : t("levelEditor.export.actions.visualizeMaze")}
          </Button>
          <Modal
            title={"Exported Level JSON"}
            trigger={
              <Button variant="primary">
                {t("levelEditor.export.actions.exportJSON")}
              </Button>
            }
          >
            <textarea
              readOnly
              value={stringifyEditorState(editor)}
              style={{
                height: "200px",
              }}
            />
            <CopyToClipboard content={stringifyEditorState(editor)} />
          </Modal>

          <Button
            variant="danger"
            onClick={() => {
              dispatch({ type: "reset" });
            }}
          >
            {t("levelEditor.export.actions.reset")}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
