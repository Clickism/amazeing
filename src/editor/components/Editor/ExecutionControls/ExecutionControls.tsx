import { useTranslation } from "react-i18next";
import { useEditorRuntime } from "../../../runtime/EditorRuntimeContext.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import {
  VscDebugContinue,
  VscDebugRestart,
  VscDebugStepOver,
  VscDebugStop,
} from "react-icons/vsc";
import { useState } from "react";
import { Tooltip } from "../../../../components/popup/Tooltip/Tooltip.tsx";
import { ExecutionSettings } from "./ExecutionSettings/ExecutionSettings.tsx";

export function ExecutionControls() {
  const [steps, setSteps] = useState(1);

  const { t } = useTranslation();
  const {
    run,
    stop,
    step,
    reset,
    isRunning,
    canStep: canEditorStep,
  } = useEditorRuntime();
  const canStep = canEditorStep();
  return (
    <ButtonGroup>
      {/* Run Controls */}
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
      <ExecutionSettings />

      <ButtonGroup.Separator />

      {/* Step Controls */}
      <Button
        variant={canStep && !isRunning ? "secondary" : "disabled"}
        disabled={!canStep || isRunning}
        onClick={() => step(steps)}
      >
        <VscDebugStepOver /> {t("editor.step")}
      </Button>
      <Tooltip content={t("editor.step.tooltip")}>
        <input
          type="number"
          min={1}
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          style={{
            width: "3rem",
          }}
        />
      </Tooltip>

      <ButtonGroup.Separator />

      {/* Reset Controls */}
      <Button onClick={reset}>
        <VscDebugRestart /> {t("editor.reset")}
      </Button>
    </ButtonGroup>
  );
}
