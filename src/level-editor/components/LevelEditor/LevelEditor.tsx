import { useReducer } from "react";
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

export function LevelEditor() {
  const [editor, dispatch] = useReducer(
    editorReducer,
    createInitialEditorState(),
  );
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
    </div>
  );
}
