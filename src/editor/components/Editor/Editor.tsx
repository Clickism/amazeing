import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { type CSSProperties } from "react";
import { ButtonGroup } from "../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { TabbedCodeEditor } from "../CodeEditor/TabbedCodeEditor.tsx";
import { useEditorRuntime } from "../../runtime/EditorRuntimeContext.tsx";
import { getTransitionSpeed } from "../../utils.ts";
import { useEditorSettings } from "../../settings/EditorSettingsContext.tsx";
import { ExecutionControls } from "./ExecutionControls/ExecutionControls.tsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

type Props = {
  tabbed?: boolean;
  allowChangingLevel?: boolean;
};

export function Editor({ tabbed = false, allowChangingLevel = false }: Props) {
  const { output, isRunning, level, owl } = useEditorRuntime();
  const { settings } = useEditorSettings();
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
              "--exec-line-transition-duration": `${getTransitionSpeed(isRunning, settings.instructionsPerSecond)}s`,
            } as CSSProperties
          }
        >
          {tabbed ? <TabbedCodeEditor /> : <CodeEditor />}
        </div>
      </div>
    </div>
  );
}
