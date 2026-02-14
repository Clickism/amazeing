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
import { ImExit } from "react-icons/im";
import { getDirectionIcon } from "../../../utils.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";

type TileProps = {
  position: Position;
} & ButtonProps;

export function Tile({ position, ...props }: TileProps) {
  const { source: level } = useLevelSource();
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
        })}
      {isFinish && <ImExit size={28} />}
    </Button>
  );
}
