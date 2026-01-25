import { Button } from "../../../../components/Button/Button.tsx";
import { FaRegMap } from "react-icons/fa";
import { Popover } from "../../../../components/floating/Popover/Popover.tsx";
import { useTranslation } from "react-i18next";
import { Level } from "../../../../game/level.ts";
import { useLevelStorage } from "../../../../game/storage/LevelStorageContext.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { useEditorRuntime } from "../../../runtime/EditorRuntimeContext.tsx";

export function LevelSelector() {
  const { t } = useTranslation();
  const { levelNames, loadLevel } = useLevelStorage();
  const { level, startingLevel, setLevel } = useEditorRuntime();
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
            const selectedLevel = loadLevel(name) ?? startingLevel.data;
            if (selectedLevel) {
              setLevel(new Level(selectedLevel));
            }
          }}
          defaultValue={level.data.name}
        >
          {[startingLevel.data.name, ...levelNames].map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </FormField>
    </Popover>
  );
}
