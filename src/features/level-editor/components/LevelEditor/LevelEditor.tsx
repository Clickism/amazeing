import { useState } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { Viewport } from "../../../editor/components/Viewport/Viewport.tsx";
import { Level } from "../../../../core/game/level.ts";
import { TileGrid } from "./TileGrid/TileGrid.tsx";
import { ToolPanel } from "./ToolPanel/ToolPanel.tsx";
import { LevelList } from "./LevelList/LevelList.tsx";
import { Panel } from "../../../../shared/components/Panel/Panel.tsx";
import { PanelContainer } from "../../../../shared/components/PanelContainer/PanelContainer.tsx";
import { useLevelEditor } from "../../context/LevelEditorContext.tsx";

// TODO: Add import task
export function LevelEditor() {
  const { level } = useLevelEditor();
  const [visualize, setVisualize] = useState(false);

  return (
    <div className={styles.levelEditor}>
      <PanelContainer
        initialSizes={[0.1, 0.8, 0.1]}
        minSize={0.1}
        minPixels={[300, 400, 210]}
      >
        <Panel className="fancy-headers">
          <ToolPanel visualize={visualize} setVisualize={setVisualize} />
        </Panel>
        <Panel paddingless className={styles.gridWindow}>
          <div
            className={clsx(
              styles.viewportContainer,
              !visualize && styles.hidden,
            )}
          >
            <Viewport
              owl={{
                position: level.owlStart.position,
                direction: level.owlStart.direction,
              }}
              level={new Level(level)}
              lockCamera={false}
              lockCameraControls={false}
            />
          </div>
          <div
            className={clsx(styles.gridContainer, visualize && styles.hidden)}
          >
            <TileGrid />
          </div>
        </Panel>
        <Panel paddingless>
          <LevelList />
        </Panel>
      </PanelContainer>
    </div>
  );
}
