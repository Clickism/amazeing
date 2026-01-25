import { useEffect, useReducer } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { editorReducer } from "../../actions.ts";
import {
  createEditorStateFromLevelData,
  createInitialEditorState,
} from "../../state.ts";
import { Viewport } from "../../../editor/components/Viewport/Viewport.tsx";
import { Level } from "../../../game/level.ts";
import { OwlImpl } from "../../../game/owl.ts";
import { TileGrid } from "./TileGrid/TileGrid.tsx";
import { ToolPanel } from "./ToolPanel/ToolPanel.tsx";
import { ExportPanel } from "./ExportPanel/ExportPanel.tsx";
import { useTranslation } from "react-i18next";
import { LevelList } from "./LevelList/LevelList.tsx";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../utils/storage.ts";
import { Panel } from "../../../components/Panel/Panel.tsx";
import { PanelContainer } from "../../../components/PanelContainer/PanelContainer.tsx";
import { useLevelStorage } from "../../../game/storage/LevelStorageContext.tsx";
import { TextPanel } from "../../../components/Panel/TextPanel/TextPanel.tsx";

export function LevelEditor() {
  const { t } = useTranslation();
  const { loadLevel } = useLevelStorage();
  const storage = usePersistentStorage("level-editor");
  const [activeLevel, setActiveLevel] = usePersistentState(
    storage,
    "activeLevel",
    t("levelStorage.newLevel.name", { num: 1 }),
  );
  const [editor, dispatch] = useReducer(
    editorReducer,
    activeLevel,
    (levelName) => {
      const loadedLevel = loadLevel(levelName);
      if (loadedLevel) {
        return createEditorStateFromLevelData(loadedLevel);
      } else {
        return createInitialEditorState(
          levelName,
          t("levelStorage.newLevel.description"),
        );
      }
    },
  );

  // Keep active level in sync with editor state
  useEffect(() => {
    setActiveLevel(editor.name);
  }, [editor.name, setActiveLevel]);

  return (
    <div className={styles.levelEditor}>
      <PanelContainer initialSizes={[0.1, 0.8, 0.1]} minSize={0.1}>
        <TextPanel>
          <ToolPanel editor={editor} dispatch={dispatch} />
          <ExportPanel editor={editor} dispatch={dispatch} />
        </TextPanel>
        <Panel className={styles.gridWindow}>
          {editor.visualize ? (
            <Viewport
              owl={
                new OwlImpl(
                  editor.owlStart.position,
                  editor.owlStart.direction,
                  () => {},
                )
              }
              level={new Level(editor)}
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
          <LevelList editor={editor} dispatch={dispatch} />
        </Panel>
      </PanelContainer>
    </div>
  );
}
