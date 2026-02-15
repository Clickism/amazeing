import type { CardinalDirection } from "../../core/interpreter/types.ts";
import type { IconBaseProps } from "react-icons";
import {
  IoArrowBack,
  IoArrowDown,
  IoArrowForward,
  IoArrowUp,
} from "react-icons/io5";

export function getDirectionIcon(
  direction: CardinalDirection,
  props?: IconBaseProps,
) {
  switch (direction) {
    case "north":
      return <IoArrowUp {...props} />;
    case "east":
      return <IoArrowForward {...props} />;
    case "south":
      return <IoArrowDown {...props} />;
    case "west":
      return <IoArrowBack {...props} />;
  }
}
