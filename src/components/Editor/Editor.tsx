import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/Button/Button.tsx";
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
import { StepControls } from "./StepControls/StepControls.tsx";
import { RunControls } from "./RunControls/RunControls.tsx";
import { TabbedCodeEditor } from "../CodeEditor/TabbedCodeEditor.tsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

// Transition
export const TRANSITION_RUN_SPEED_THRESHOLD = 30;
export const DEFAULT_TRANSITION_SPEED = 0.1;
export const MAX_TRANSITION_SPEED = 0.2;

type Props = {
  tabbed?: boolean;
  startingFileName?: string;
};

export function Editor({ tabbed, startingFileName }: Props) {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<ConsoleMessage[]>([]);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [runIntervalId, setRunIntervalId] = useState<number | null>(null);
  const [runSpeed, setRunSpeed] = useState(DEFAULT_RUN_SPEED);

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
      if (runIntervalId !== null) {
        clearInterval(runIntervalId);
        setRunIntervalId(null);
      }
      setOutput([]);
      setCurrentLine(interpreter.current.getCurrentLine());
    } catch (e) {
      if (e instanceof Error) {
        // Clear previous output for parsing error
        setOutput([{ type: "error", text: e.message }]);
      }
    }
  }, [code, runIntervalId, appendOutput]);

  useEffect(() => {
    initInterpreter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function handleReset() {
    initInterpreter();
  }

  const isRunning = runIntervalId !== null;
  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div title={t("viewport.title")} className={styles.viewport}>
          <Viewport />
        </div>
        <ButtonGroup center>
          <RunControls
            interpreter={interpreter}
            setCurrentLine={setCurrentLine}
            appendOutput={appendOutput}
            runSpeed={runSpeed}
            setRunSpeed={setRunSpeed}
            runIntervalId={runIntervalId}
            setRunIntervalId={setRunIntervalId}
          />
          <ButtonGroup.Separator />
          <StepControls
            interpreter={interpreter}
            appendOutput={appendOutput}
            setCurrentLine={setCurrentLine}
            isRunning={isRunning}
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
        <div
          title={t("codeEditor.title")}
          className={styles.codeEditor}
          style={
            {
              "--exec-line-transition-duration": `${getTransitionSpeed(isRunning, runSpeed)}s`,
            } as CSSProperties
          }
        >
          {tabbed ? (
            <TabbedCodeEditor
              code={code}
              setCode={setCode}
              currentLine={currentLine}
              runSpeed={runSpeed}
              isRunning={isRunning}
              startingFileName={startingFileName}
            />
          ) : (
            <CodeEditor
              code={code}
              setCode={setCode}
              currentLine={currentLine}
              runSpeed={runSpeed}
              isRunning={isRunning}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Calculates the adjusted transition speed
 */
function getTransitionSpeed(isRunning: boolean, runSpeed: number) {
  if (!isRunning) {
    return DEFAULT_TRANSITION_SPEED;
  }
  if (runSpeed >= TRANSITION_RUN_SPEED_THRESHOLD) {
    return 0;
  }
  // Between MAX and DEFAULT
  const belowDefault =
    DEFAULT_TRANSITION_SPEED +
    (MAX_TRANSITION_SPEED - DEFAULT_TRANSITION_SPEED) *
      (1 - runSpeed / DEFAULT_RUN_SPEED);
  // Between DEFAULT and 0
  const t =
    (runSpeed - DEFAULT_RUN_SPEED) /
    (TRANSITION_RUN_SPEED_THRESHOLD - DEFAULT_RUN_SPEED);
  const aboveOrAtDefault = DEFAULT_TRANSITION_SPEED * (1 - t);
  // Clamp
  return Math.min(
    MAX_TRANSITION_SPEED,
    runSpeed < DEFAULT_RUN_SPEED ? belowDefault : aboveOrAtDefault,
  );
}
