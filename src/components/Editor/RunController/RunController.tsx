import { ButtonGroup } from "../../ui/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../ui/Button/Button.tsx";
import { VscDebugContinue, VscSettings } from "react-icons/vsc";
import { type RefObject, useState } from "react";
import type { Interpreter } from "../../../interpreter/interpreter.ts";
import type { ConsoleMessage } from "../../../interpreter/console.ts";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import { FormField } from "../../ui/Form/FormField/FormField.tsx";

const MIN_SPEED = 1;
const MAX_SPEED = 100;
const DEFAULT_SPEED = 50;

type Props = {
  interpreter: RefObject<Interpreter | null>;
  setCurrentLine: (line: number | null) => void;
  appendOutput: (message: ConsoleMessage) => void;
};

export function RunController({
  interpreter,
  appendOutput,
  setCurrentLine,
}: Props) {
  const { t } = useTranslation();
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  function handleRun() {
    try {
      if (!interpreter.current) return;
      interpreter.current.run();
      setCurrentLine(interpreter.current.getCurrentLine());
    } catch (e) {
      if (e instanceof Error) {
        appendOutput({ type: "error", text: e.message });
      }
    }
  }

  const canStep = interpreter.current?.canStep() ?? false;

  return (
    <ButtonGroup>
      <Button
        variant={canStep ? "secondary" : "disabled"}
        disabled={!canStep}
        onClick={handleRun}
      >
        <VscDebugContinue /> {t("editor.run")}
      </Button>
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
            min={MIN_SPEED}
            max={MAX_SPEED}
            defaultValue={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </FormField>
      </Popup>

      {/*<Button>*/}
      {/*  <VscDebugStop /> Stop*/}
      {/*</Button>*/}
    </ButtonGroup>
  );
}
