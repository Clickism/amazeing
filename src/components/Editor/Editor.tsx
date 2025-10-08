import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { VscDebugRestart } from "react-icons/vsc";
import { StepController } from "./StepController/StepController.tsx";
import { RunController } from "./RunController/RunController.tsx";

type Props = {
  filename?: string;
};

export function Editor({ filename }: Props) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<ConsoleMessage[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(0);
  const { t } = useTranslation();

  const interpreter = useRef<Interpreter | null>(null);

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
          <RunController
            interpreter={interpreter}
            setCurrentLine={setCurrentLine}
            appendOutput={appendOutput}
          />
          <ButtonGroup.Separator />
          <StepController
            interpreter={interpreter}
            appendOutput={appendOutput}
            setCurrentLine={setCurrentLine}
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
