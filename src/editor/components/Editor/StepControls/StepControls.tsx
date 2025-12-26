import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { VscDebugStepOver } from "react-icons/vsc";
import { Button } from "../../../../components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEditorRuntime } from "../../../runtime/EditorRuntimeContext.tsx";

export function StepControls() {
  const [steps, setSteps] = useState(1);
  const { t } = useTranslation();
  const { step, canStep: canEditorStep, isRunning } = useEditorRuntime();
  const canStep = canEditorStep();
  return (
    <ButtonGroup>
      <Button
        variant={canStep && !isRunning ? "secondary" : "disabled"}
        disabled={!canStep || isRunning}
        onClick={() => step(steps)}
      >
        <VscDebugStepOver /> {t("editor.step")}
      </Button>
      <input
        type="number"
        min={1}
        value={steps}
        onChange={(e) => setSteps(Number(e.target.value))}
        style={{
          width: "3rem",
        }}
      />
    </ButtonGroup>
  );
}
