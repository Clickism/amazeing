import { ButtonGroup } from "../../ui/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../ui/Button/Button.tsx";
import { VscDebugContinue, VscDebugStop, VscSettings } from "react-icons/vsc";
import { type RefObject, useEffect } from "react";
import type { Interpreter } from "../../../interpreter/interpreter.ts";
import type { ConsoleMessage } from "../../../interpreter/console.ts";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import { FormField } from "../../ui/Form/FormField/FormField.tsx";
import { MAX_RUN_SPEED, MIN_RUN_SPEED } from "../Editor.tsx";

type Props = {
  interpreter: RefObject<Interpreter | null>;
  setCurrentLine: (line: number | null) => void;
  appendOutput: (message: ConsoleMessage) => void;
  runSpeed: number;
  setRunSpeed: (speed: number) => void;
  runIntervalId: number | null;
  setRunIntervalId: (id: number | null) => void;
};

export function RunControls({
  interpreter,
  appendOutput,
  setCurrentLine,
  runSpeed,
  setRunSpeed,
  runIntervalId,
  setRunIntervalId,
}: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (runIntervalId !== null) {
      // Restart interval with new speed
      clearInterval(runIntervalId);
      startRunning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSpeed]);

  function stopRunning() {
    if (runIntervalId !== null) {
      clearInterval(runIntervalId);
      setRunIntervalId(null);
    }
  }

  function startRunning() {
    const interval = setInterval(() => {
      if (interpreter.current?.canStep()) {
        try {
          interpreter.current?.step();
          setCurrentLine(interpreter.current.getCurrentLine());
        } catch (e) {
          if (e instanceof Error) {
            appendOutput({ type: "error", text: e.message });
          }
        }
      } else {
        stopRunning();
      }
    }, 1000 / runSpeed);
    setRunIntervalId(interval);
  }

  const canStep = interpreter.current?.canStep() ?? false;
  return (
    <ButtonGroup>
      {runIntervalId === null ? (
        <Button
          variant={canStep ? "success" : "disabled"}
          disabled={!canStep}
          onClick={startRunning}
        >
          <VscDebugContinue /> {t("editor.run")}
        </Button>
      ) : (
        <Button
          variant="danger"
          onClick={stopRunning}
        >
          <VscDebugStop /> {t("editor.stop")}
        </Button>
      )}

      <Popup
        trigger={
          <Button variant="icon-only">
            <VscSettings size={20} />
          </Button>
        }
      >
        <FormField label={t("editor.runSpeed")}>
          <input
            type="range"
            min={MIN_RUN_SPEED}
            max={MAX_RUN_SPEED}
            defaultValue={runSpeed}
            onChange={(e) => setRunSpeed(Number(e.target.value))}
          />
        </FormField>
        {runSpeed}
      </Popup>

      {/*<Button>*/}
      {/*  <VscDebugStop /> Stop*/}
      {/*</Button>*/}
    </ButtonGroup>
  );
}
