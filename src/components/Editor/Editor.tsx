import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import * as React from "react";
import { Button } from "../ui/Button/Button.tsx";
import {
  Interpreter,
  InterpreterConsole,
} from "../../interpreter/interpreter.ts";
import "../../prism/amazeing.ts";
import { ButtonGroup } from "../ui/Button/ButtonGroup/ButtonGroup.tsx";

export function Editor() {
  const [code, setCode] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");
  const [currentLine, setCurrentLine] = React.useState<number | null>(0);

  const appendOutput = (msg: string) => {
    setOutput((prev) => prev + msg + "\n");
  }

  const interpreter = React.useRef<Interpreter | null>(null);

  const initInterpreter = () => {
    try {
      interpreter.current = Interpreter.fromCode(
        code,
        new InterpreterConsole((msg) => {
          appendOutput(`${msg.message}`);
        }),
      );
    } catch (e) {
      if (e instanceof Error) {
        setOutput(e.message);
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
        appendOutput(e.message);
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
        appendOutput(e.message);
      }
    }
  }

  const handleReset = () => {
    initInterpreter();
    setOutput("");
    setCurrentLine(interpreter.current?.getCurrentLine() ?? null);
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div className={styles.viewport}>
          <Viewport />
        </div>
        <ButtonGroup stretch>
          <Button onClick={handleRun}>Run</Button>
          <Button onClick={handleStep}>Step</Button>
          <Button onClick={handleReset}>Reset</Button>
        </ButtonGroup>
        <div className={styles.console}>
          <Console text={output} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.codeEditor}>
          <CodeEditor code={code} setCode={setCode} currentLine={currentLine} />
        </div>
      </div>
    </div>
  );
}
