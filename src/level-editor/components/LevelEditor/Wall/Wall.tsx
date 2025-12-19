import type { WallType } from "../../../../game/maze.ts";
import {
  Button,
  type ButtonProps,
} from "../../../../components/ui/Button/Button.tsx";
import clsx from "clsx";
import styles from "./Wall.module.css";

export function Wall({
  wall,
  horizontal,
  ...props
}: { wall: WallType; horizontal?: boolean } & ButtonProps) {
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
