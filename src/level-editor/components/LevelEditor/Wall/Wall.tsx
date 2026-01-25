import type { WallType } from "../../../../game/maze.ts";
import {
  Button,
  type ButtonProps,
} from "../../../../components/Button/Button.tsx";
import clsx from "clsx";
import styles from "./Wall.module.css";
import type { LevelEditorState } from "../../../state.ts";
import type { CSSProperties } from "react";

type WallProps = {
  wall: WallType;
  horizontal?: boolean;
  editor: LevelEditorState;
} & ButtonProps;

export function Wall({ wall, horizontal, editor, ...props }: WallProps) {
  const inBetween = editor.level.maze.tileType;
  return (
    <Button
      variant="none"
      className={clsx(styles.wall, horizontal && styles.wallHorizontal)}
      style={
        {
          "--background-color": wall
            ? `var(--wall-color-${wall})`
            : `var(--tile-color-${inBetween})`,
        } as CSSProperties
      }
      {...props}
    />
  );
}
