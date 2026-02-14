import { useEffect, useReducer } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { editorReducer } from "../../actions.ts";
import { emptyEditorState } from "../../state.ts";
import { Viewport } from "../../../editor/components/Viewport/Viewport.tsx";
import { Level } from "../../../game/level.ts";
import { TileGrid } from "./TileGrid/TileGrid.tsx";
import { ToolPanel } from "./ToolPanel/ToolPanel.tsx";
import { ExportPanel } from "./ExportPanel/ExportPanel.tsx";
import { LevelList } from "./LevelList/LevelList.tsx";
import { Panel } from "../../../components/Panel/Panel.tsx";
import { PanelContainer } from "../../../components/PanelContainer/PanelContainer.tsx";
import { TextPanel } from "../../../components/Panel/TextPanel/TextPanel.tsx";
import { useLevelSource } from "../../../editor/source/SourceContext.tsx";

// TODO: Refactor for new structure and fix level/file editing
export function LevelEditor() {
  const { name: activeLevel, loadSource } = useLevelSource();
  const [editor, dispatch] = useReducer(
    editorReducer,
    emptyEditorState(activeLevel),
  );

  // Keep editor state up to date with active level
  useEffect(() => {
    if (!activeLevel) return;
    const level = loadSource();
    if (level) {
      dispatch({ type: "setLevel", level });
    }
  }, [activeLevel, loadSource]);

  return (
    <div className={styles.levelEditor}>
      <PanelContainer
        initialSizes={[0.1, 0.8, 0.1]}
        minSize={0.1}
        minPixels={[300, 400, 200]}
      >
        <TextPanel>
          <ToolPanel editor={editor} dispatch={dispatch} />
          <ExportPanel editor={editor} dispatch={dispatch} />
        </TextPanel>
        <Panel paddingless className={styles.gridWindow}>
          {editor.visualize ? (
            <Viewport
              owl={{
                position: editor.level.owlStart.position,
                direction: editor.level.owlStart.direction,
              }}
              level={new Level(editor.level)}
              lockCamera={false}
              lockCameraControls={false}
            />
          ) : (
            <div className={clsx(styles.gridContainer)}>
              <TileGrid editor={editor} dispatch={dispatch} />
            </div>
          )}
        </Panel>
        <Panel paddingless>
          <LevelList />
        </Panel>
      </PanelContainer>
    </div>
  );
}
