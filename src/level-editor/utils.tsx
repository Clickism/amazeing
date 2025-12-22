import type { CardinalDirection } from "../interpreter/types.ts";
import type { IconBaseProps } from "react-icons";
import {
  FaArrowCircleDown,
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaArrowCircleUp,
} from "react-icons/fa";

export function getDirectionIcon(
  direction: CardinalDirection,
  props?: IconBaseProps,
) {
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
