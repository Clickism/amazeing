import { ButtonGroup } from "../../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import {
  CARDINAL_DIRECTIONS,
  isPositionEqual,
  type Position,
} from "../../../../../interpreter/types.ts";
import { Button } from "../../../../../components/Button/Button.tsx";
import { getDirectionIcon } from "../../../../utils.tsx";
import { useLevelSource } from "../../../../../editor/source/SourceContext.tsx";
import { useTranslation } from "react-i18next";

export function TilePlacer({ position }: { position: Position }) {
  const { source: level, setSource: setLevel } = useLevelSource();
  const { t } = useTranslation();
  return (
    <ButtonGroup vertical stretch>
      <h6 className="fancy-headers">
        {t("levelEditor.tools.tileOptions.start")}
      </h6>
      <ButtonGroup>
        {CARDINAL_DIRECTIONS.map((direction) => (
          <Button
            key={direction}
            variant="outlined"
            disabled={isPositionEqual(level.finishPosition, position)}
            onClick={() => {
              setLevel({
                ...level,
                owlStart: {
                  position,
                  direction,
                },
              });
            }}
          >
            {getDirectionIcon(direction, { size: 22 })}
          </Button>
        ))}
      </ButtonGroup>
      <h6 className="fancy-headers">
        {t("levelEditor.tools.tileOptions.finish")}
      </h6>
      <Button
        variant="outlined"
        disabled={isPositionEqual(level.owlStart.position, position)}
        onClick={() => {
          setLevel({
            ...level,
            finishPosition: position,
          });
        }}
      >
        Place Finish
      </Button>
    </ButtonGroup>
  );
}
