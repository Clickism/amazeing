import { useEffect, useReducer } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { editorReducer } from "../../actions.ts";
import { createInitialEditorState } from "../../state.ts";
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

export function LevelEditor() {
  const { t } = useTranslation();
  const storage = usePersistentStorage("level-editor");
  const [activeLevel, setActiveLevel] = usePersistentState(
    storage,
    "activeLevel",
    t("levelStorage.newLevel.name", { num: 1 }),
  );
  const [editor, dispatch] = useReducer(
    editorReducer,
    createInitialEditorState(activeLevel),
  );

  // Keep active level in sync with editor state
  useEffect(() => {
    setActiveLevel(editor.name);
  }, [editor.name, setActiveLevel]);

  return (
    <div className={styles.levelEditor}>
      <div className={clsx(styles.panel, "window-border")}>
        <ToolPanel editor={editor} dispatch={dispatch} />
      </div>

      <div className={clsx(styles.gridWindow, "window-border")}>
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
      </div>

      <div className={clsx(styles.panel, "window-border")}>
        <ExportPanel editor={editor} dispatch={dispatch} />
      </div>

      <LevelList editor={editor} dispatch={dispatch} />
    </div>
  );
}
