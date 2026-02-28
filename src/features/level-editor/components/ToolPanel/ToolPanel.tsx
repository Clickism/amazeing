import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../shared/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { GENERAL_TOOLS } from "../../tools.tsx";
import { tryTranslate } from "../../../../shared/i18n/i18n.ts";
import { CornerGroup } from "../../../../shared/components/CornerGroup/CornerGroup.tsx";
import styles from "./ToolPanel.module.css";
import { MultiSourceControls } from "../../../editor/components/MultiSourceControls/MultiSourceControls.tsx";
import { PillSwitch } from "../../../../shared/components/PillSwitch/PillSwitch.tsx";
import { TaskExport } from "./TaskExport/TaskExport.tsx";
import { MazeProperties } from "./MazeProperties/MazeProperties.tsx";
import { useLevelEditor } from "../../context/LevelEditorContext.tsx";
import { TaskImport } from "./TaskImport/TaskImport.tsx";

type ToolPanelProps = {
  visualize: boolean;
  setVisualize: (visualize: boolean) => void;
};

export function ToolPanel({ visualize, setVisualize }: ToolPanelProps) {
  const { t } = useTranslation();
  const { level, setLevel, source } = useLevelEditor();
  const currentLevelName = source.activeSource.name;
  return (
    <>
      <CornerGroup position="top-left" className={styles.cornerGroup}>
        <Button variant="highlighted" className={styles.title}>
          {currentLevelName}
        </Button>
        <MultiSourceControls source={source} />
      </CornerGroup>

      <div className={styles.separator} />

      <h5>{t("levelEditor.headers.mode")}</h5>

      <PillSwitch
        layoutId="tool-mode-switch"
        options={[
          { id: "edit", name: t("levelEditor.modes.edit") },
          { id: "visualize", name: t("levelEditor.modes.visualize") },
        ]}
        selectedOptionId={visualize ? "visualize" : "edit"}
        onSelect={(id: string) => setVisualize(id === "visualize")}
      />

      <h5>{t("levelEditor.headers.maze")}</h5>

      <MazeProperties />

      <h5>{t("levelEditor.headers.tools")}</h5>

      <ButtonGroup vertical stretch>
        {GENERAL_TOOLS.map((generalTool, i) => (
          <Button key={i} onClick={() => generalTool.onClick(level, setLevel)}>
            {tryTranslate(t, generalTool.name)}
          </Button>
        ))}
      </ButtonGroup>

      <h5>{t("levelEditor.headers.actions")}</h5>

      <ButtonGroup vertical stretch>
        <TaskExport />
        <TaskImport />
        {/*<Button*/}
        {/*  variant="danger"*/}
        {/*  onClick={() => {*/}
        {/*    setLevel(emptyLevelData());*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <VscDebugRestart />*/}
        {/*  {t("levelEditor.actions.reset")}*/}
        {/*</Button>*/}
      </ButtonGroup>
    </>
  );
}
