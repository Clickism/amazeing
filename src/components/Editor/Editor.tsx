import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Button } from "../ui/Button/Button.tsx";
import "../../prism/amazeing.ts";
import { ButtonGroup } from "../ui/Button/ButtonGroup/ButtonGroup.tsx";
import {
  type ConsoleMessage,
  InterpreterConsole,
} from "../../interpreter/console.ts";
import { useTranslation } from "react-i18next";
import {
  type Interpreter,
  LazyInterpreter,
} from "../../interpreter/interpreter.ts";
import { VscDebugContinue, VscDebugRestart } from "react-icons/vsc";
import { StepController } from "./StepController/StepController.tsx";

type Props = {
  filename?: string;
};

export function Editor({ filename }: Props) {
  const [code, setCode] = React.useState<string>("");
  const [output, setOutput] = React.useState<ConsoleMessage[]>([]);
  const [currentLine, setCurrentLine] = React.useState<number | null>(0);
  const { t } = useTranslation();

  const interpreter = React.useRef<Interpreter | null>(null);

  const appendOutput = useCallback((message: ConsoleMessage) => {
    setOutput((prev) => [...prev, message]);
  }, []);

  const initInterpreter = useCallback(() => {
    try {
      interpreter.current = LazyInterpreter.fromCode(
        code,
        new InterpreterConsole((message) => {
          appendOutput(message);
        }),
      );
      setOutput([]);
      setCurrentLine(interpreter.current.getCurrentLine());
    } catch (e) {
      if (e instanceof Error) {
        // Clear previous output for parsing error
        setOutput([{ type: "error", text: e.message }]);
      }
    }
  }, [code, appendOutput]);

  useEffect(() => {
    initInterpreter();
  }, [code, initInterpreter]);

  function logErrorToConsole<T>(fn: () => T) {
    try {
      return fn();
    } catch (e) {
      if (e instanceof Error) {
        appendOutput({ type: "error", text: e.message });
      }
    }
  }

  function handleSteps(steps: number) {
    logErrorToConsole(() => {
      if (!interpreter.current) return;
      interpreter.current.stepMultiple(steps);
      setCurrentLine(interpreter.current.getCurrentLine());
    });
  }

  function handleRun() {
    logErrorToConsole(() => {
      if (!interpreter.current) return;
      interpreter.current.run();
      setCurrentLine(interpreter.current.getCurrentLine());
    });
  }

  function handleReset() {
    initInterpreter();
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div title={t("viewport.title")} className={styles.viewport}>
          <Viewport />
        </div>
        <ButtonGroup center>
          <Button
            variant={interpreter.current?.canStep() ? "secondary" : "disabled"}
            disabled={!interpreter.current?.canStep()}
            onClick={handleRun}
          >
            <VscDebugContinue /> {t("editor.run")}
          </Button>
          {/*<Button>*/}
          {/*  <VscDebugStop /> Stop*/}
          {/*</Button>*/}
          <ButtonGroup.Separator />
          <StepController
            canStep={interpreter.current?.canStep() ?? false}
            handleSteps={handleSteps}
          />
          <ButtonGroup.Separator />
          <Button onClick={handleReset}>
            <VscDebugRestart /> {t("editor.reset")}
          </Button>
        </ButtonGroup>
        <div title={t("console.title")} className={styles.console}>
          <Console messages={output} />
        </div>
      </div>
      <div className={styles.right}>
        <div title={t("codeEditor.title")} className={styles.codeEditor}>
          <CodeEditor
            code={code}
            setCode={setCode}
            currentLine={currentLine}
            filename={filename}
          />
        </div>
      </div>
    </div>
  );
}
