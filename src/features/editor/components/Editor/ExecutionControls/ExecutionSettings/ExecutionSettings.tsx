import { Button } from "../../../../../../shared/components/Button/Button.tsx";
import { VscSettings } from "react-icons/vsc";
import { FormField } from "../../../../../../shared/components/Form/FormField/FormField.tsx";
import { MAX_RUN_SPEED, MIN_RUN_SPEED } from "../../Editor.tsx";
import { Popover } from "../../../../../../shared/components/floating/Popover/Popover.tsx";
import { useTranslation } from "react-i18next";
import { useEditorSettings } from "../../../../context/settings/EditorSettingsContext.tsx";
import { useState } from "react";

export function ExecutionSettings() {
  const { t } = useTranslation();
  const {
    settings: { instructionsPerSecond, isInstant },
    setSettings,
  } = useEditorSettings();

  const [localSpeed, setLocalSpeed] = useState(instructionsPerSecond);
  const [localIsInstant, setLocalIsInstant] = useState(isInstant);

  const commit = () => {
    setSettings({
      instructionsPerSecond: localSpeed,
      isInstant: localIsInstant,
    });
  };

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
          localIsInstant
            ? t("editor.settings.speed.unlimited")
            : `${localSpeed} instr/s`
        }
        unitWidth={85}
      >
        <input
          type="range"
          min={MIN_RUN_SPEED}
          max={MAX_RUN_SPEED + 1}
          defaultValue={localSpeed}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (newValue > MAX_RUN_SPEED) {
              setLocalIsInstant(true);
            } else {
              setLocalSpeed(newValue);
              setLocalIsInstant(false);
            }
          }}
          onMouseUp={commit}
          onTouchEnd={commit}
        />
      </FormField>
    </Popover>
  );
}
