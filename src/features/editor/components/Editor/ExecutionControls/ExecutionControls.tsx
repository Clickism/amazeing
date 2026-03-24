import { useTranslation } from "react-i18next";
import { ButtonGroup } from "../../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../../shared/components/Button/Button.tsx";
import {
  VscDebugContinue,
  VscDebugRestart,
  VscDebugStepOver,
  VscDebugStop,
} from "react-icons/vsc";
import { useState } from "react";
import { Tooltip } from "../../../../../shared/floating/components/Tooltip/Tooltip.tsx";
import { ExecutionSettings } from "./ExecutionSettings/ExecutionSettings.tsx";
import { useCalculateLayout } from "../../../../../shared/utils/useCalculateLayout.tsx";
import { useExecution } from "../../../context/interpreter/contexts/ExecutionContext.tsx";
import { useBreakpoints } from "../../../context/interpreter/contexts/BreakpointsContext.tsx";

export function ExecutionControls() {
  const [steps, setSteps] = useState(1);

  const { t } = useTranslation();
  const {
    run,
    stop,
    step,
    reset,
    isRunning,
    currentLine,
    canStep: canEditorStep,
  } = useExecution();
  const { isBreakpoint } = useBreakpoints();
  const canStep = canEditorStep();
  const { isMobile } = useCalculateLayout();
  const atBreakpoint = isBreakpoint(currentLine ?? -1);
  return (
    <ButtonGroup>
      {/* Run Controls */}
      {isRunning ? (
        <Button variant="danger" onClick={stop}>
          <VscDebugStop /> {isMobile ? "" : t("editor.stop")}
        </Button>
      ) : atBreakpoint ? (
        <Button
          variant={canStep ? "warning" : "disabled"}
          disabled={!canStep}
          onClick={run}
        >
          <VscDebugContinue /> {isMobile ? "" : t("editor.continue")}
        </Button>
      ) : (
        <Button
          variant={canStep ? "success" : "disabled"}
          disabled={!canStep}
          onClick={run}
        >
          <VscDebugContinue /> {isMobile ? "" : t("editor.run")}
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

      {/*{owlControls && (*/}
      {/*  <>*/}
      {/*    <ButtonGroup.Separator />*/}
      {/*    <OwlControls />*/}
      {/*  </>*/}
      {/*)}*/}
    </ButtonGroup>
  );
}
