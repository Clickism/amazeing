import type { TileType } from "../../../../game/maze.ts";
import {
  Button,
  type ButtonProps,
} from "../../../../components/ui/Button/Button.tsx";
import clsx from "clsx";
import styles from "../LevelEditor.module.css";
import {
  type CardinalDirection,
  isPositionEqual,
  type Position,
} from "../../../../interpreter/types.ts";
import type { EditorState } from "../../../state.ts";
import {
  FaArrowCircleDown,
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaArrowCircleUp,
} from "react-icons/fa";
import type { IconBaseProps } from "react-icons";
import { ImExit } from "react-icons/im";

type TileProps = {
  tile: TileType;
  editor: EditorState;
  position: Position;
};

export function Tile({
  tile,
  editor,
  position,
  ...props
}: TileProps & ButtonProps) {
  const isStart = isPositionEqual(editor.owlStart.position, position);
  const isFinish = isPositionEqual(editor.finishPosition, position);
  return (
    <Button
      variant="none"
      className={clsx(
        styles.tile,
        styles[`tile-${tile}`],
        isStart && styles.startTile,
        isFinish && styles.finishTile,
      )}
      {...props}
      flex
    >
      {isStart &&
        getDirectionIcon(editor.owlStart.direction, {
          className: styles.startArrow,
          size: 32,
        })}
      {isFinish && <ImExit size={28} fill={"var(--clr-danger-a10)"} />}
    </Button>
  );
}

function getDirectionIcon(direction: CardinalDirection, props?: IconBaseProps) {
  switch (direction) {
    case "north":
      return <FaArrowCircleUp {...props} />;
    case "east":
      return <FaArrowCircleRight {...props} />;
    case "south":
      return <FaArrowCircleDown {...props} />;
    case "west":
      return <FaArrowCircleLeft {...props} />;
  }
}
