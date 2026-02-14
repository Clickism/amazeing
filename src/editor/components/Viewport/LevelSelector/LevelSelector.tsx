import { Button } from "../../../../components/Button/Button.tsx";
import { FaRegMap } from "react-icons/fa";
import { Popover } from "../../../../components/floating/Popover/Popover.tsx";
import { useTranslation } from "react-i18next";
import { useLevelStorage } from "../../../../level-editor/storage/LevelStorageContext.tsx";
import { useLevel } from "../../../runtime/LevelContext.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { Level } from "../../../../game/level.ts";

export function LevelSelector() {
  const { t } = useTranslation();
  const { levelNames, loadLevel } = useLevelStorage();
  const { level, setLevel, initialLevel } = useLevel();
  return (
    <Popover
      title={t("levelSelector.title")}
      trigger={
        <Button shape="icon">
          <FaRegMap />
        </Button>
      }
    >
      <FormField label={t("levelSelector.level")}>
        <select
          onChange={(e) => {
            const name = e.target.value;
            const selectedLevel = loadLevel(name) ?? initialLevel.data;
            if (selectedLevel) {
              setLevel(new Level(selectedLevel));
            }
          }}
          defaultValue={level.data.name}
        >
          {[initialLevel.data.name, ...levelNames].map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </FormField>
    </Popover>
  );
}
