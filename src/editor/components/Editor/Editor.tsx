import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { type CSSProperties } from "react";
import { Button } from "../../../components/Button/Button.tsx";
import { ButtonGroup } from "../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { useTranslation } from "react-i18next";
import { VscDebugRestart } from "react-icons/vsc";
import { StepControls } from "./StepControls/StepControls.tsx";
import { RunControls } from "./RunControls/RunControls.tsx";
import { TabbedCodeEditor } from "../CodeEditor/TabbedCodeEditor.tsx";
import { useEditorRuntime } from "../../runtime/EditorRuntimeContext.tsx";
import { getTransitionSpeed } from "../../utils.ts";
import { useEditorSettings } from "../../settings/EditorSettingsContext.tsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

type Props = {
  levelSelector?: boolean;
  tabbed?: boolean;
};

export function Editor({ tabbed, levelSelector }: Props) {
  const { t } = useTranslation();
  const { reset, output, isRunning, level, owl } = useEditorRuntime();
  const { settings } = useEditorSettings();
  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div title={t("viewport.title")} className={styles.viewport}>
          <Viewport level={level} owl={owl} levelSelector={levelSelector} />
        </div>
        <ButtonGroup center>
          <RunControls />
          <ButtonGroup.Separator />
          <StepControls />
          <ButtonGroup.Separator />
          <Button onClick={reset}>
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
