import { useState } from "react";
import styles from "./LevelEditor.module.css";
import clsx from "clsx";
import { Viewport } from "../../../editor/components/Viewport/Viewport.tsx";
import { Level } from "../../../game/level.ts";
import { TileGrid } from "./TileGrid/TileGrid.tsx";
import { ToolPanel } from "./ToolPanel/ToolPanel.tsx";
import { ExportPanel } from "./ExportPanel/ExportPanel.tsx";
import { LevelList } from "./LevelList/LevelList.tsx";
import { Panel } from "../../../components/Panel/Panel.tsx";
import { PanelContainer } from "../../../components/PanelContainer/PanelContainer.tsx";
import { useLevelSource } from "../../../editor/source/SourceContext.tsx";

// TODO: Refactor for new structure and fix level/file editing
export function LevelEditor() {
  const { source: level } = useLevelSource();
  const [visualize, setVisualize] = useState(false);

  return (
    <div className={styles.levelEditor}>
      <PanelContainer
        initialSizes={[0.1, 0.8, 0.1]}
        minSize={0.1}
        minPixels={[300, 400, 200]}
      >
        <Panel className="fancy-headers">
          <ToolPanel />
          <ExportPanel visualize={visualize} setVisualize={setVisualize} />
        </Panel>
        <Panel paddingless className={styles.gridWindow}>
          {visualize ? (
            <Viewport
              owl={{
                position: level.owlStart.position,
                direction: level.owlStart.direction,
              }}
              level={new Level(level)}
              lockCamera={false}
              lockCameraControls={false}
            />
          ) : (
            <div className={clsx(styles.gridContainer)}>
              <TileGrid />
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
