import type { TileType } from "../../../../game/maze.ts";
import {
  Button,
  type ButtonProps,
} from "../../../../components/Button/Button.tsx";
import clsx from "clsx";
import styles from "./Tile.module.css";
import {
  isPositionEqual,
  type Position,
} from "../../../../interpreter/types.ts";
import type { LevelEditorState } from "../../../state.ts";
import { ImExit } from "react-icons/im";
import type { CSSProperties } from "react";
import { getDirectionIcon } from "../../../utils.tsx";

type TileProps = {
  tile: TileType;
  editor: LevelEditorState;
  position: Position;
} & ButtonProps;

export function Tile({ tile, editor, position, ...props }: TileProps) {
  const level = editor.level;
  const isStart = isPositionEqual(level.owlStart.position, position);
  const isFinish = isPositionEqual(level.finishPosition, position);
  return (
    <Button
      variant="none"
      className={clsx(
        styles.tile,
        styles[`tile-${tile}`],
        isStart && styles.startTile,
        isFinish && styles.finishTile,
      )}
      style={
        {
          "--background-color": tile ? `var(--tile-color-${tile})` : undefined,
        } as CSSProperties
      }
      {...props}
      flex
    >
      {isStart &&
        getDirectionIcon(level.owlStart.direction, {
          className: styles.startArrow,
          size: 32,
        })}
      {isFinish && <ImExit size={28} fill={"var(--clr-danger-a10)"} />}
    </Button>
  );
}
