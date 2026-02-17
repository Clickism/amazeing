import { ButtonGroup } from "../../../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import {
  CARDINAL_DIRECTIONS,
  isPositionEqual,
  type Position,
} from "../../../../../../core/interpreter/types.ts";
import { Button } from "../../../../../../shared/components/Button/Button.tsx";
import { getDirectionIcon } from "../../../../utils.tsx";
import { useTranslation } from "react-i18next";
import { useLevelEditor } from "../../../../context/LevelEditorContext.tsx";

export function TileProperties({ position }: { position: Position }) {
  const { level, setLevel } = useLevelEditor();
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
        disabled={isPositionEqual(level.owlStart.position, position)}
        onClick={() => {
          setLevel({
            ...level,
            finishPosition: position,
          });
        }}
      >
        {t("levelEditor.tools.tileOptions.finish")}
      </Button>
    </ButtonGroup>
  );
}
