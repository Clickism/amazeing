import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { type CSSProperties } from "react";
import { ButtonGroup } from "../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { useEditorRuntime } from "../../runtime/EditorRuntimeContext.tsx";
import { getTransitionSpeed } from "../../utils.ts";
import { useEditorSettings } from "../../settings/EditorSettingsContext.tsx";
import { ExecutionControls } from "./ExecutionControls/ExecutionControls.tsx";
import { currentLineHighlighter } from "../../../codemirror/currentLineHighlighter.ts";
import { FileEditor } from "../FileEditor/FileEditor.tsx";
import { FileSourceProvider } from "../../source/FileSourceProvider.tsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

type Props = {
  file?: boolean;
  allowChangingLevel?: boolean;
};

export function Editor({ file, allowChangingLevel = false }: Props) {
  const { output, isRunning, level, owl, code, setCode, currentLine } =
    useEditorRuntime();
  const { settings } = useEditorSettings();
  const transitionDuration = getTransitionSpeed(
    isRunning,
    settings.instructionsPerSecond,
  );
  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div className={styles.viewport}>
          <Viewport
            level={level}
            owl={owl}
            levelSelector={allowChangingLevel}
          />
        </div>
        <ButtonGroup center>
          <ExecutionControls />
        </ButtonGroup>
        <div className={styles.console}>
          <Console messages={output} />
        </div>
      </div>
      <div className={styles.right}>
        <div
          className={styles.codeEditor}
          style={
            {
              "--exec-line-transition-duration": `${transitionDuration}s`,
            } as CSSProperties
          }
        >
          {file ? (
            <FileSourceProvider code={code} setCode={setCode}>
              <FileEditor
                setCode={setCode}
                editorExtensions={[currentLineHighlighter(() => currentLine)]}
              />
            </FileSourceProvider>
          ) : (
            <CodeEditor
              title="Hello"
              code={code}
              setCode={setCode}
              editorExtensions={[currentLineHighlighter(() => currentLine)]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
