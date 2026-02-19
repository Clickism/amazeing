import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { FaRegMap } from "react-icons/fa";
import { Popover } from "../../../../../shared/components/floating/Popover/Popover.tsx";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../../shared/components/Form/FormField/FormField.tsx";
import { Level, type LevelData } from "../../../../../core/game/level.ts";
import { useLevel } from "../../../context/level/LevelContext.tsx";
import type { FileStorage } from "../../../context/storage/fileStorage.ts";

type LevelSelectorProps = {
  levelStorage: FileStorage<LevelData>;
};

export function LevelSelector({ levelStorage }: LevelSelectorProps) {
  const { t } = useTranslation();
  const { level, setLevel, initialLevel } = useLevel();
  const { fileNames, loadFile } = levelStorage;
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
            console.log(loadFile(name))
            const selectedLevel = loadFile(name) ?? initialLevel.data;
            if (selectedLevel) {
              console.log(selectedLevel);
              setLevel(new Level(selectedLevel));
            }
          }}
          defaultValue={level.data.name}
        >
          {[initialLevel.data.name, ...fileNames].map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </FormField>
    </Popover>
  );
}
