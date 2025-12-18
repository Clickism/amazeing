import { Fragment, useState } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { Button, type ButtonProps } from "../ui/Button/Button.tsx";
import { FormGroup } from "../ui/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../ui/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../ui/Button/ButtonGroup/ButtonGroup.tsx";
import {
  TILE_TYPES,
  type TileType,
  WALL_TYPES,
  type WallType,
} from "../../game/maze.ts";
import { titleCase } from "../../utils/utils.ts";

function Tile({ tile, ...props }: { tile: TileType | null } & ButtonProps) {
  return (
    <Button
      variant="none"
      className={clsx(styles.tile, styles[`tile-${tile}`])}
      {...props}
    />
  );
}

function Wall({
  wall,
  horizontal,
  ...props
}: { wall: WallType | null; horizontal?: boolean } & ButtonProps) {
  return (
    <Button
      variant="none"
      className={clsx(
        styles.wall,
        horizontal && styles.wallHorizontal,
        styles[`wall-${wall}`],
      )}
      {...props}
    />
  );
}

function makeMatrix<T>(rows: number, cols: number, fill: T): T[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => fill),
  );
}

export function LevelEditor() {
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);

  const [selectedTile, setSelectedTile] = useState<TileType | null>("grass");
  const [selectedWall, setSelectedWall] = useState<WallType | null>("stone");

  const [tiles, setTiles] = useState<(TileType | null)[][]>(
    makeMatrix(height, width, null),
  );

  const horizontalWallsHeight = height - 1;
  const horizontalWallsWidth = width;

  const verticalWallsHeight = height;
  const verticalWallsWidth = width - 1;

  const [horizontalWalls, setHorizontalWalls] = useState<(WallType | null)[][]>(
    makeMatrix(horizontalWallsHeight, horizontalWallsWidth, null),
  );

  const [verticalWalls, setVerticalWalls] = useState<(WallType | null)[][]>(
    makeMatrix(verticalWallsHeight, verticalWallsWidth, null),
  );

  function modifiedMatrixAt<T>(
    matrix: T[][],
    row: number,
    col: number,
    value: T,
  ) {
    const newMatrix = matrix.map((r) => r.slice());
    newMatrix[row][col] = value;
    return newMatrix;
  }

  function setTileAt(row: number, col: number, tile: TileType | null) {
    setTiles(modifiedMatrixAt(tiles, row, col, tile));
  }

  function setHorizontalWallAt(
    row: number,
    col: number,
    wall: WallType | null,
  ) {
    setHorizontalWalls(modifiedMatrixAt(horizontalWalls, row, col, wall));
  }

  function setVerticalWallAt(row: number, col: number, wall: WallType | null) {
    setVerticalWalls(modifiedMatrixAt(verticalWalls, row, col, wall));
  }

  return (
    <div className={styles.levelEditor}>
      <div className={clsx(styles.settingsContainer, "window-border")}>
        <h4>Level Editor 🎨</h4>
        <h5>Maze Size</h5>
        <FormGroup horizontal stretch>
          <FormField label="Width">
            <input
              type="number"
              value={width}
              min={1}
              max={50}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </FormField>
          <FormField label="Height">
            <input
              type="number"
              value={height}
              min={1}
              max={50}
              onChange={(e) => setHeight(Number(e.target.value))}
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
              {titleCase(tile)}
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
              {titleCase(wall)}
            </Button>
          ))}
        </ButtonGroup>

        <h5>Tools</h5>

        <ButtonGroup vertical stretch>
          <Button
            onClick={() => {
              setTiles(makeMatrix(height, width, selectedTile));
            }}
          >
            Fill All Tiles
          </Button>
          <Button
            onClick={() => {
              setTiles(makeMatrix(height, width, null));
            }}
          >
            Clear All Tiles
          </Button>
          <Button
            onClick={() => {
              setHorizontalWalls(
                makeMatrix(
                  horizontalWallsHeight,
                  horizontalWallsWidth,
                  selectedWall,
                ),
              );
              setVerticalWalls(
                makeMatrix(
                  verticalWallsHeight,
                  verticalWallsWidth,
                  selectedWall,
                ),
              );
            }}
          >
            Fill All Walls
          </Button>
          <Button
            onClick={() => {
              setHorizontalWalls(
                makeMatrix(horizontalWallsHeight, horizontalWallsWidth, null),
              );
              setVerticalWalls(
                makeMatrix(verticalWallsHeight, verticalWallsWidth, null),
              );
            }}
          >
            Clear All Walls
          </Button>
        </ButtonGroup>

        <h5>Actions</h5>

        <ButtonGroup vertical stretch>
          <Button variant="primary">Export JSON</Button>
          <Button variant="danger">Reset</Button>
        </ButtonGroup>
      </div>
      <div className={clsx(styles.grid, "window-border")}>
        {Array.from({ length: height }).map((_, ri) => (
          <Fragment key={ri}>
            <div className={styles.gridRow}>
              {Array.from({ length: width }).map((_, ci) => (
                <Fragment key={ci}>
                  <Tile
                    tile={tiles[ri][ci]}
                    onClick={() => {
                      const tile = tiles[ri][ci];
                      if (tile === selectedTile) {
                        setTileAt(ri, ci, null);
                      } else {
                        setTileAt(ri, ci, selectedTile);
                      }
                    }}
                  />
                  {ci < width - 1 && (
                    <Wall
                      wall={verticalWalls[ri][ci]}
                      onClick={() => {
                        const wall = verticalWalls[ri][ci];
                        if (wall === selectedWall) {
                          setVerticalWallAt(ri, ci, null);
                        } else {
                          setVerticalWallAt(ri, ci, selectedWall);
                        }
                      }}
                    />
                  )}
                </Fragment>
              ))}
            </div>
            {ri < height - 1 && (
              <div className={clsx(styles.gridRow, styles.wallRow)}>
                {Array.from({ length: width }).map((_, ci) => (
                  <Wall
                    key={ci}
                    wall={horizontalWalls[ri][ci]}
                    horizontal
                    onClick={() => {
                      const wall = horizontalWalls[ri][ci];
                      if (wall === selectedWall) {
                        setHorizontalWallAt(ri, ci, null);
                      } else {
                        setHorizontalWallAt(ri, ci, selectedWall);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
