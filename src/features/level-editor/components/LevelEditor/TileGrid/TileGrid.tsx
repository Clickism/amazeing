import styles from "./TileGrid.module.css";
import { Fragment } from "react";
import { Tile } from "../Tile/Tile.tsx";
import { Wall } from "../Wall/Wall.tsx";
import clsx from "clsx";
import { Popover } from "../../../../../shared/components/floating/Popover/Popover.tsx";
import { TileProperties } from "./TileProperties/TileProperties.tsx";
import { useTranslation } from "react-i18next";
import { useLevelEditor } from "../../../context/LevelEditorContext.tsx";

export function TileGrid() {
  const { t } = useTranslation();
  const { level, setLevel } = useLevelEditor();
  const maze = level.maze;
  const rows = Array.from({ length: maze.height });
  const columns = Array.from({ length: maze.width });

  const onWallClick = (
    position: { x: number; y: number },
    horizontal: boolean,
  ) => {
    const walls = level.maze.walls;
    const currentWall = horizontal
      ? walls.horizontal[position.y][position.x]
      : walls.vertical[position.y][position.x];
    const newWall = !currentWall;
    if (horizontal) {
      walls.horizontal[position.y][position.x] = newWall;
    } else {
      walls.vertical[position.y][position.x] = newWall;
    }
    setLevel({
      ...level,
      maze: {
        ...level.maze,
        walls: {
          ...walls,
          horizontal: walls.horizontal,
          vertical: walls.vertical,
        },
      },
    });
  };

  return (
    <div className={styles.grid}>
      {rows.map((_, row) => (
        <Fragment key={row}>
          <div className={styles.gridRow}>
            {columns.map((_, col) => (
              <Fragment key={col}>
                <Popover
                  title={t("levelEditor.tools.tileOptions")}
                  noTooltip
                  trigger={<Tile position={{ x: col, y: row }} />}
                >
                  <TileProperties position={{ x: col, y: row }} />
                </Popover>

                {/*Horizontal Walls*/}
                {col < maze.width - 1 && (
                  <Wall
                    wall={maze.walls.vertical[row][col]}
                    onClick={() => onWallClick({ x: col, y: row }, false)}
                  />
                )}
              </Fragment>
            ))}
          </div>

          {/*Vertical Walls*/}
          {row < maze.height - 1 && (
            <div className={clsx(styles.gridRow, styles.wallRow)}>
              {columns.map((_, col) => (
                <Wall
                  key={col}
                  wall={maze.walls.horizontal[row][col]}
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
