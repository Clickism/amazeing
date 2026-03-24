import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";
import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { getTransitionSpeed } from "../../utils.ts";
import { useEditorSettings } from "../../context/settings/EditorSettingsContext.tsx";
import { ExecutionControls } from "./ExecutionControls/ExecutionControls.tsx";
import { currentLineHighlighter } from "../../../../core/amazeing/currentLineHighlighter.ts";
import { FileCodeEditor } from "../FileCodeEditor/FileCodeEditor.tsx";
import { PanelContainer } from "../../../../shared/components/PanelContainer/PanelContainer.tsx";
import { Panel } from "../../../../shared/components/Panel/Panel.tsx";
import { TaskCodeEditor } from "../TaskCodeEditor/TaskCodeEditor.tsx";
import type { FileStorage } from "../../context/storage/fileStorage.ts";
import type { LevelData } from "../../../../core/game/level.ts";
import { useCalculateLayout } from "../../../../shared/utils/useCalculateLayout.tsx";
import clsx from "clsx";
import { useState } from "react";
import { fileEditorMinWidths, taskEditorMinWidths } from "../../widths.ts";
import {
  breakpointDisplay,
  breakpointTheme,
  lineNumbersClickable,
} from "../../../../core/amazeing/breakpoints.ts";
import { useSourceType } from "../../context/code/SourceTypeContext.tsx";
import { useOutput } from "../../context/interpreter/contexts/OutputContext.tsx";
import { useGame } from "../../context/interpreter/contexts/GameContext.tsx";
import type { PanelMinWidths } from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import { useExecution } from "../../context/interpreter/contexts/ExecutionContext.tsx";
import { useBreakpoints } from "../../context/interpreter/contexts/BreakpointsContext.tsx";

export const MIN_RUN_SPEED = 1;
export const MAX_RUN_SPEED = 100;
export const DEFAULT_RUN_SPEED = 5;

export type EditorProps = {
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

const SEPARATOR_WIDTH = 8;

export function Editor({ levelStorage }: EditorProps) {
  const { isMultiSource } = useSourceType();
  const { isMobile } = useCalculateLayout();
  // Open by default if not multi-source (sandbox)
  const [codePanelOpen, setCodePanelOpen] = useState(!isMultiSource);
  let minWidths = isMultiSource ? fileEditorMinWidths : taskEditorMinWidths;
  if (minWidths.mobile && isMobile) {
    // Use mobile widths
    minWidths = minWidths.mobile;
  }
  const codeEditorWidth = codePanelOpen
    ? minWidths.codePanel + minWidths.sidePanel + SEPARATOR_WIDTH
    : minWidths.codePanel;
  const viewportWidth = 570;

  return (
    <div className={clsx(styles.editorContainer, isMobile && styles.mobile)}>
      <PanelContainer
        orientation={!isMobile ? "horizontal" : "vertical"}
        minPixels={[viewportWidth, codeEditorWidth]}
      >
        <PanelContainer
          orientation="vertical"
          initialSizes={[0.6, 0.4]}
          minSize={0.2}
        >
          <Panel paddingless>
            <ViewportWrapper levelStorage={levelStorage} />
          </Panel>
          <div className={styles.consolePanel}>
            <ButtonGroup center>
              <ExecutionControls />
            </ButtonGroup>
            <Panel className={styles.console} paddingless>
              <ConsoleWrapper />
            </Panel>
          </div>
        </PanelContainer>
        <CodeEditorWrapper
          minWidths={minWidths}
          setCodePanelOpen={setCodePanelOpen}
        />
      </PanelContainer>
    </div>
  );
}

function ConsoleWrapper() {
  const { output } = useOutput();
  return <Console messages={output} />;
}

function ViewportWrapper({
  levelStorage,
}: {
  levelStorage?: FileStorage<LevelData>;
}) {
  const { level, owl, marks } = useGame();
  return (
    <Viewport
      level={level}
      owl={owl}
      levelStorage={levelStorage}
      marks={marks}
    />
  );
}

function CodeEditorWrapper({
  minWidths,
  setCodePanelOpen,
}: {
  minWidths: PanelMinWidths;
  setCodePanelOpen: (open: boolean) => void;
}) {
  const { isMultiSource } = useSourceType();
  const { breakpoints, setBreakpoints } = useBreakpoints();
  const { isRunning, currentLine } = useExecution();
  const { settings } = useEditorSettings();
  const transitionDuration = getTransitionSpeed(
    isRunning,
    settings.instructionsPerSecond,
  );

  // Editor extensions
  const extensions = [
    currentLineHighlighter(() => currentLine),
    lineNumbersClickable((line) => {
      setBreakpoints((prev) => {
        if (!prev.includes(line)) {
          return [...prev, line];
        }
        return prev.filter((l) => l !== line);
      });
    }),
    breakpointDisplay(breakpoints),
    breakpointTheme,
  ];

  return isMultiSource ? (
    <FileCodeEditor
      editorExtensions={extensions}
      transitionDuration={transitionDuration}
      onPanelChange={(open) => {
        setCodePanelOpen(open);
      }}
      minWidths={minWidths}
    />
  ) : (
    <TaskCodeEditor
      editorExtensions={extensions}
      transitionDuration={transitionDuration}
      onPanelChange={(open) => {
        setCodePanelOpen(open);
      }}
      minWidths={minWidths}
    />
  );
}
