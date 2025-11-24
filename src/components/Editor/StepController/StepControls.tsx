import { ButtonGroup } from "../../ui/Button/ButtonGroup/ButtonGroup.tsx";
import { VscDebugStepOver } from "react-icons/vsc";
import { Button } from "../../ui/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { type RefObject, useState } from "react";
import type { Interpreter } from "../../../interpreter/interpreter.ts";
import type { ConsoleMessage } from "../../../interpreter/console.ts";

type Props = {
  interpreter: RefObject<Interpreter | null>;
  setCurrentLine: (line: number | null) => void;
  appendOutput: (message: ConsoleMessage) => void;
  isRunning: boolean;
};

export function StepControls({
  interpreter,
  setCurrentLine,
  isRunning,
}: Props) {
  const [steps, setSteps] = useState(1);
  const { t } = useTranslation();

  function handleSteps(steps: number) {
    interpreter.current?.executeAndPrintError((interpreter) => {
      interpreter.stepMultiple(steps);
      setCurrentLine(interpreter.getCurrentLine());
    });
  }
  const canStep = interpreter.current?.canStep() ?? false;
  return (
    <ButtonGroup>
      <Button
        variant={canStep && !isRunning ? "secondary" : "disabled"}
        disabled={!canStep || isRunning}
        onClick={() => handleSteps(steps)}
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
