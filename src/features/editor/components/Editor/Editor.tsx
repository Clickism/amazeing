import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { useInterpreter } from "../../context/interpreter/InterpreterContext.tsx";
import { getTransitionSpeed } from "../../utils.ts";
import { useEditorSettings } from "../../context/settings/EditorSettingsContext.tsx";
import { ExecutionControls } from "./ExecutionControls/ExecutionControls.tsx";
import { currentLineHighlighter } from "../../../../core/amazeing/currentLineHighlighter.ts";
import { FileCodeEditor } from "../FileCodeEditor/FileCodeEditor.tsx";
import { PanelContainer } from "../../../../shared/components/PanelContainer/PanelContainer.tsx";
import { Panel } from "../../../../shared/components/Panel/Panel.tsx";
import { TaskCodeEditor } from "../TaskCodeEditor/TaskCodeEditor.tsx";
import { useCodeModel } from "../../context/code/CodeModelContext.tsx";
import { isMultiSource } from "../../context/source/source.ts";
import type { FileStorage } from "../../context/storage/fileStorage.ts";
import type { LevelData } from "../../../../core/game/level.ts";
import { useCalculateLayout } from "../../../../shared/utils/useCalculateLayout.tsx";
import clsx from "clsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

export type EditorProps = {
  /**
   * Whether to allow moving the owl manually, and show the controls for it.
   */
  owlControls?: boolean;
  /**
   * Allows changing the level in the viewport, and uses the
   * provided level storage to save and load levels.
   *
   * If not provided, the level is fixed and cannot be changed by the user.
   *
   * @see ViewportProps.levelStorage
   */
  levelStorage?: FileStorage<LevelData>;
};

export function Editor({ levelStorage, owlControls = false }: EditorProps) {
  const { output, isRunning, level, owlData, currentLine } = useInterpreter();
  const { source } = useCodeModel();
  const { settings } = useEditorSettings();
  const transitionDuration = getTransitionSpeed(
    isRunning,
    settings.instructionsPerSecond,
  );
  const { isMobile } = useCalculateLayout();
  return (
    <div className={clsx(styles.editorContainer, isMobile && styles.mobile)}>
      <PanelContainer
        orientation={!isMobile ? "horizontal" : "vertical"}
        minSize={0.3}
        minPixels={[owlControls ? 620 : 570, 400]}
      >
        <PanelContainer
          orientation="vertical"
          initialSizes={[0.6, 0.4]}
          minSize={0.2}
        >
          <Panel paddingless>
            <Viewport level={level} owl={owlData} levelStorage={levelStorage} />
          </Panel>
          <div className={styles.consolePanel}>
            <ButtonGroup center>
              <ExecutionControls owlControls={owlControls} />
            </ButtonGroup>
            <Panel className={styles.console} paddingless>
              <Console messages={output} />
            </Panel>
          </div>
        </PanelContainer>
        {isMultiSource(source) ? (
          <FileCodeEditor
            editorExtensions={[currentLineHighlighter(() => currentLine)]}
            transitionDuration={transitionDuration}
          />
        ) : (
          <TaskCodeEditor
            editorExtensions={[currentLineHighlighter(() => currentLine)]}
            transitionDuration={transitionDuration}
          />
        )}
      </PanelContainer>
    </div>
  );
}
