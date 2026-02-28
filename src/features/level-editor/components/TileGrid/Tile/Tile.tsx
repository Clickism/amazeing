import {
  Button,
  type ButtonProps,
} from "../../../../../shared/components/Button/Button.tsx";
import clsx from "clsx";
import styles from "./Tile.module.css";
import {
  isPositionEqual,
  type Position,
} from "../../../../../core/interpreter/types.ts";
import { getDirectionIcon } from "../../../utils.tsx";
import { FaFlag } from "react-icons/fa6";
import { useLevelEditor } from "../../../context/LevelEditorContext.tsx";

type TileProps = {
  position: Position;
} & ButtonProps;

export function Tile({ position, ...props }: TileProps) {
  const { level } = useLevelEditor();
  const isStart = isPositionEqual(level.owlStart.position, position);
  const isFinish = isPositionEqual(level.finishPosition, position);
  return (
    <Button
      variant="none"
      className={clsx(
        styles.tile,
        isStart && styles.startTile,
        isFinish && styles.finishTile,
      )}
      {...props}
      flex
    >
      {isStart &&
        getDirectionIcon(level.owlStart.direction, {
          className: styles.startArrow,
          size: 32,
          color: "#fff",
        })}
      {isFinish && <FaFlag size={28} fill={"#fff"} />}
    </Button>
  );
}
