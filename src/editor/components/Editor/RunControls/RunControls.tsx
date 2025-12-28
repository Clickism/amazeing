import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { VscDebugContinue, VscDebugStop, VscSettings } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { useEditorRuntime } from "../../../runtime/EditorRuntimeContext.tsx";
import { MAX_RUN_SPEED, MIN_RUN_SPEED } from "../Editor.tsx";
import { useEditorSettings } from "../../../settings/EditorSettingsContext.tsx";
import { Popover } from "../../../../components/popup/Popover/Popover.tsx";

export function RunControls() {
  const { t } = useTranslation();
  const { run, stop, isRunning, canStep: canEditorStep } = useEditorRuntime();
  const {
    settings: { instructionsPerSecond, isInstant },
    setSettings,
  } = useEditorSettings();
  const canStep = canEditorStep();
  return (
    <ButtonGroup>
      {isRunning ? (
        <Button variant="danger" onClick={stop}>
          <VscDebugStop /> {t("editor.stop")}
        </Button>
      ) : (
        <Button
          variant={canStep ? "success" : "disabled"}
          disabled={!canStep}
          onClick={run}
        >
          <VscDebugContinue /> {t("editor.run")}
        </Button>
      )}

      <Popover
        title={t("editor.runSettings")}
        trigger={
          <Button shape="icon">
            <VscSettings size={20} />
          </Button>
        }
      >
        <FormField
          label={t("editor.runSpeed")}
          unit={`${instructionsPerSecond} instr/s`}
          unitWidth={85}
        >
          <input
            type="range"
            min={MIN_RUN_SPEED}
            max={MAX_RUN_SPEED}
            defaultValue={instructionsPerSecond}
            onChange={(e) => {
              setSettings({ instructionsPerSecond: Number(e.target.value) });
            }}
          />
        </FormField>
        <FormField label={t("editor.runInstant")}>
          <input
            type="checkbox"
            checked={isInstant}
            onChange={(e) => {
              stop();
              setSettings({ isInstant: e.target.checked });
            }}
          />
        </FormField>
      </Popover>
    </ButtonGroup>
  );
}
