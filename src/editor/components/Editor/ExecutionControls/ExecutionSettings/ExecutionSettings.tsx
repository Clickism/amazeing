import { Button } from "../../../../../components/Button/Button.tsx";
import { VscSettings } from "react-icons/vsc";
import { FormField } from "../../../../../components/Form/FormField/FormField.tsx";
import { MAX_RUN_SPEED, MIN_RUN_SPEED } from "../../Editor.tsx";
import { Popover } from "../../../../../components/popup/Popover/Popover.tsx";
import { useTranslation } from "react-i18next";
import { useEditorSettings } from "../../../../settings/EditorSettingsContext.tsx";

export function ExecutionSettings() {
  const { t } = useTranslation();
  const {
    settings: { instructionsPerSecond, isInstant },
    setSettings,
  } = useEditorSettings();
  return (
    <Popover
      title={t("editor.settings")}
      trigger={
        <Button shape="icon">
          <VscSettings size={20} />
        </Button>
      }
    >
      <FormField
        label={t("editor.settings.speed")}
        unit={
          isInstant
            ? t("editor.settings.speed.unlimited")
            : `${instructionsPerSecond} instr/s`
        }
        unitWidth={85}
      >
        <input
          type="range"
          min={MIN_RUN_SPEED}
          max={MAX_RUN_SPEED + 1}
          defaultValue={instructionsPerSecond}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (newValue > MAX_RUN_SPEED) {
              setSettings({ isInstant: true });
            } else {
              setSettings({
                instructionsPerSecond: newValue,
                isInstant: false,
              });
            }
          }}
        />
      </FormField>
    </Popover>
  );
}
