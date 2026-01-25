import { useEffect, useReducer, useRef } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { editorReducer } from "../../actions.ts";
import { emptyEditorState, emptyLevelData } from "../../state.ts";
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
import { useLevelStorage } from "../../storage/LevelStorageContext.tsx";
import { TextPanel } from "../../../components/Panel/TextPanel/TextPanel.tsx";

export function LevelEditor() {
  const { t } = useTranslation();
  const { loadLevel, saveLevel } = useLevelStorage();
  const storage = usePersistentStorage("level-editor");
  const [activeLevel, setActiveLevel] = usePersistentState(
    storage,
    "activeLevel",
    t("levelStorage.newLevel.name", { num: 1 }),
  );
  const [editor, dispatch] = useReducer(
    editorReducer,
    emptyEditorState(activeLevel, t("levelStorage.newLevel.description")),
  );
  const loadedLevelRef = useRef<string | null>(null);

  useEffect(() => {
    if (loadedLevelRef.current === activeLevel) return;
    loadedLevelRef.current = activeLevel;
    const loadedLevel = loadLevel(activeLevel);
    if (loadedLevel) {
      dispatch({ type: "setLevel", level: loadedLevel });
    } else {
      dispatch({
        type: "setLevel",
        level: emptyLevelData(
          activeLevel,
          t("levelStorage.newLevel.description"),
        ),
      });
    }
  }, [activeLevel, loadLevel, t]);

  useEffect(() => {
    if (editor.level.name !== activeLevel) {
      setActiveLevel(editor.level.name);
    }
  }, [editor.level.name, activeLevel, setActiveLevel]);

  const prevLevelRef = useRef(editor.level);

  useEffect(() => {
    // Avoid saving on rename
    console.log("Saving!");
    if (prevLevelRef.current?.name === editor.level.name) {
      prevLevelRef.current = editor.level;
      saveLevel(editor.level);
    }
  }, [editor.level, saveLevel]);

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
                  editor.level.owlStart.position,
                  editor.level.owlStart.direction,
                  () => {},
                )
              }
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
          <LevelList editor={editor} dispatch={dispatch} />
        </Panel>
      </PanelContainer>
    </div>
  );
}
