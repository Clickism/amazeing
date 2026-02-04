import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { ButtonGroup } from "../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { useEditorRuntime } from "../../runtime/EditorRuntimeContext.tsx";
import { getTransitionSpeed } from "../../utils.ts";
import { useEditorSettings } from "../../settings/EditorSettingsContext.tsx";
import { ExecutionControls } from "./ExecutionControls/ExecutionControls.tsx";
import { currentLineHighlighter } from "../../../codemirror/currentLineHighlighter.ts";
import { FileEditor } from "../FileEditor/FileEditor.tsx";
import { FileSourceProvider } from "../../source/FileSourceProvider.tsx";
import { PanelContainer } from "../../../components/PanelContainer/PanelContainer.tsx";
import { Panel } from "../../../components/Panel/Panel.tsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

type Props = {
  file?: boolean;
  owlControls?: boolean;
  allowChangingLevel?: boolean;
};

export function Editor({
  file,
  allowChangingLevel = false,
  owlControls = false,
}: Props) {
  const { output, isRunning, level, owlData, code, setCode, currentLine } =
    useEditorRuntime();
  const { settings } = useEditorSettings();
  const transitionDuration = getTransitionSpeed(
    isRunning,
    settings.instructionsPerSecond,
  );
  return (
    <div className={styles.editorContainer}>
      <PanelContainer orientation="horizontal" minSize={0.3}>
        <PanelContainer
          orientation="vertical"
          initialSizes={[0.6, 0.4]}
          minSize={0.2}
        >
          <Panel paddingless>
            <Viewport
              level={level}
              owl={owlData}
              levelSelector={allowChangingLevel}
            />
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
        {file ? (
          <FileSourceProvider code={code} setCode={setCode}>
            <FileEditor
              setCode={setCode}
              editorExtensions={[currentLineHighlighter(() => currentLine)]}
              transitionDuration={transitionDuration}
            />
          </FileSourceProvider>
        ) : (
          <Panel paddingless>
            <CodeEditor
              title="Hello"
              code={code}
              setCode={setCode}
              editorExtensions={[currentLineHighlighter(() => currentLine)]}
              transitionDuration={transitionDuration}
            />
          </Panel>
        )}
      </PanelContainer>
    </div>
  );
}
