import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import * as React from "react";
import { Button } from "../ui/Button/Button.tsx";
import { Interpreter } from "../../interpreter/interpreter.ts";
import '../../prism/amazeing.ts';
import { ButtonGroup } from "../ui/Button/ButtonGroup/ButtonGroup.tsx";

export function Editor() {
  const [code, setCode] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");

  const handleRun = () => {
    try {
      const interpreter = Interpreter.fromCode(code);
      interpreter.step();
      setOutput(JSON.stringify(interpreter.env));
    } catch (e) {
      if (e instanceof Error) {
        setOutput(e.message);
      }
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div className={styles.viewport}>
          <Viewport />
        </div>
        <ButtonGroup stretch>
          <Button onClick={handleRun}>Run</Button>
          <Button onClick={handleRun}>Step</Button>
        </ButtonGroup>
        <div className={styles.console}>
          <Console text={output} />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.codeEditor}>
          <CodeEditor code={code} setCode={setCode} />
        </div>
      </div>
    </div>
  );
}
