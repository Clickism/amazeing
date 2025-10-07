import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import * as React from "react";
import { Button } from "../ui/Button/Button.tsx";
import "../../prism/amazeing.ts";
import { ButtonGroup } from "../ui/Button/ButtonGroup/ButtonGroup.tsx";
import {
  type ConsoleMessage,
  InterpreterConsole,
} from "../../interpreter/console.ts";
import { Interpreter } from "../../interpreter/interpreter.ts";
import { useTranslation } from "react-i18next";

export function Editor() {
  const [code, setCode] = React.useState<string>("");
  const [output, setOutput] = React.useState<ConsoleMessage[]>([]);
  const [currentLine, setCurrentLine] = React.useState<number | null>(0);
  const { t } = useTranslation();

  const appendOutput = (message: ConsoleMessage) => {
    setOutput((prev) => [...prev, message]);
  };

  const interpreter = React.useRef<Interpreter | null>(null);

  const initInterpreter = () => {
    try {
      interpreter.current = Interpreter.fromCode(
        code,
        new InterpreterConsole((message) => {
          appendOutput(message);
        }),
      );
    } catch (e) {
      if (e instanceof Error) {
        appendOutput({ type: "error", text: e.message });
      }
    }
  };

  const handleStep = () => {
    if (!interpreter.current) {
      initInterpreter();
    }
    try {
      interpreter.current?.step();
      setCurrentLine(interpreter.current?.getCurrentLine() ?? null);
    } catch (e) {
      if (e instanceof Error) {
        appendOutput({ type: "error", text: e.message });
      }
    }
  };

  const handleRun = () => {
    if (!interpreter.current) {
      initInterpreter();
    }
    try {
      interpreter.current?.run();
    } catch (e) {
      if (e instanceof Error) {
        appendOutput({ type: "error", text: e.message });
      }
    }
  };

  const handleReset = () => {
    initInterpreter();
    setOutput([]);
    setCurrentLine(interpreter.current?.getCurrentLine() ?? null);
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div title={t("viewport.title")} className={styles.viewport}>
          <Viewport />
        </div>
        <ButtonGroup stretch>
          <Button onClick={handleRun}>Run</Button>
          <Button onClick={handleStep}>Step</Button>
          <Button onClick={handleReset}>Reset</Button>
        </ButtonGroup>
        <div title={t("console.title")} className={styles.console}>
          <Console messages={output} />
        </div>
      </div>
      <div className={styles.right}>
        <div title={t("codeEditor.title")} className={styles.codeEditor}>
          <CodeEditor code={code} setCode={setCode} currentLine={currentLine}/>
        </div>
      </div>
    </div>
  );
}
