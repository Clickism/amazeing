import {
  Button,
  type ButtonProps,
} from "../../../../../shared/components/Button/Button.tsx";
import clsx from "clsx";
import styles from "./Wall.module.css";

type WallProps = {
  wall: boolean;
  horizontal?: boolean;
} & ButtonProps;

export function Wall({ wall, horizontal, ...props }: WallProps) {
  return (
    <Button
      variant="none"
      className={clsx(
        styles.wall,
        horizontal && styles.wallHorizontal,
        wall && styles.filledWall,
      )}
      {...props}
    />
  );
}
