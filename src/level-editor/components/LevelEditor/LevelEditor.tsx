import { useMemo, useReducer } from "react";
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
import { ListPanel } from "../../../components/ListPanel/ListPanel.tsx";
import { useLevelStorage } from "../../../game/storage/LevelStorageContext.tsx";
import { Button } from "../../../components/Button/Button.tsx";
import { useTranslation } from "react-i18next";

export function LevelEditor() {
  const { t } = useTranslation();
  const [editor, dispatch] = useReducer(
    editorReducer,
    createInitialEditorState("Level #1"),
  );
  const { levels, addLevel } = useLevelStorage();
  const levelNames = useMemo(() => levels.map((l) => l.name), [levels]);
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

      <ListPanel
        elements={levelNames}
        activeElement={editor.name}
        onSelectElement={(name) => {
          const selectedLevel = levels.find((level) => level.name === name);
          if (selectedLevel) {
            dispatch({ type: "setLevel", level: selectedLevel });
          }
        }}
      >
        <Button
          onClick={() => {
            let newLevelName = t("levelStorage.newLevel.name", { num: 1 });
            let counter = 1;
            while (levels.find((level) => level.name === newLevelName)) {
              counter++;
              newLevelName = t("levelStorage.newLevel.name", { num: counter });
            }
            addLevel(createInitialEditorState(newLevelName));
          }}
        >
          + New Level
        </Button>
      </ListPanel>
    </div>
  );
}
