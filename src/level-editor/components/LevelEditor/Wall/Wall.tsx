import type { WallType } from "../../../../game/maze.ts";
import {
  Button,
  type ButtonProps,
} from "../../../../components/ui/Button/Button.tsx";
import clsx from "clsx";
import styles from "./Wall.module.css";
import type { EditorState } from "../../../state.ts";
import type { Position } from "../../../../interpreter/types.ts";
import type { CSSProperties } from "react";

type WallProps = {
  wall: WallType;
  horizontal?: boolean;
  position: Position;
  editor: EditorState;
} & ButtonProps;

export function Wall({
  wall,
  horizontal,
  position,
  editor,
  ...props
}: WallProps) {
  // const inBetween =
  const { x, y } = position;
  let tileA, tileB;
  if (horizontal) {
    tileA = editor.maze.tiles[y][x];
    tileB = editor.maze.tiles[y + 1][x];
  } else {
    tileA = editor.maze.tiles[y][x];
    tileB = editor.maze.tiles[y][x + 1];
  }
  const inBetween = tileA === tileB ? tileA : null;
  return (
    <Button
      variant="none"
      className={clsx(styles.wall, horizontal && styles.wallHorizontal)}
      style={
        {
          "--background-color": wall
            ? `var(--wall-color-${wall})`
            : inBetween
              ? `var(--tile-color-${inBetween})`
              : undefined,
        } as CSSProperties
      }
      {...props}
    />
  );
}
