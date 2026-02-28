import { useTranslation } from "react-i18next";
import { useInterpreter } from "../../../context/interpreter/InterpreterContext.tsx";
import { ButtonGroup } from "../../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../../shared/components/Button/Button.tsx";
import {
  VscDebugContinue,
  VscDebugRestart,
  VscDebugStepOver,
  VscDebugStop,
} from "react-icons/vsc";
import { useState } from "react";
import { Tooltip } from "../../../../../shared/floating/Tooltip/Tooltip.tsx";
import { ExecutionSettings } from "./ExecutionSettings/ExecutionSettings.tsx";
import { OwlControls } from "./OwlControls/OwlControls.tsx";
import { useCalculateLayout } from "../../../../../shared/utils/useCalculateLayout.tsx";

type ExecutionControlsProps = {
  owlControls?: boolean;
};

export function ExecutionControls({
  owlControls = false,
}: ExecutionControlsProps) {
  const [steps, setSteps] = useState(1);

  const { t } = useTranslation();
  const {
    run,
    stop,
    step,
    reset,
    isRunning,
    canStep: canEditorStep,
  } = useInterpreter();
  const canStep = canEditorStep();
  const { isMobile } = useCalculateLayout();
  return (
    <ButtonGroup>
      {/* Run Controls */}
      {isRunning ? (
        <Button
          variant="danger"
          onClick={stop}
        >
          <VscDebugStop /> {isMobile ? "" : t("editor.stop")}
        </Button>
      ) : (
        <Button
          variant={canStep ? "success" : "disabled"}
          disabled={!canStep}
          onClick={run}
        >
          <VscDebugContinue />{" "}
          {isMobile ? "" : t("editor.run")}
        </Button>
      )}
      <ExecutionSettings />

      <ButtonGroup.Separator />

      {/* Step Controls */}
      <Button
        shape={isMobile ? "icon" : "default"}
        variant={canStep && !isRunning ? "secondary" : "disabled"}
        disabled={!canStep || isRunning}
        onClick={() => step(steps)}
      >
        <VscDebugStepOver /> {isMobile ? "" : t("editor.step")}
      </Button>
      <Tooltip content={t("editor.step.tooltip")}>
        <input
          type="number"
          min={1}
          value={steps}
          onChange={(e) => setSteps(Number(e.target.value))}
          style={{
            width: isMobile ? "2.25rem" : "4rem",
            paddingLeft: isMobile ? ".75rem" : undefined,
            minWidth: 0,
          }}
        />
      </Tooltip>

      <ButtonGroup.Separator />

      {/* Reset Controls */}
      <Button shape={isMobile ? "icon" : "default"} onClick={reset}>
        <VscDebugRestart /> {isMobile ? "" : t("editor.reset")}
      </Button>

      {owlControls && (
        <>
          <ButtonGroup.Separator />
          <OwlControls />
        </>
      )}
    </ButtonGroup>
  );
}
