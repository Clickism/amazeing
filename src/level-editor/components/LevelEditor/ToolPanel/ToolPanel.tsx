import { FormGroup } from "../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { GENERAL_TOOLS } from "../../../tools.tsx";
import { tryTranslate } from "../../../../i18n/i18n.ts";
import { MAZE_THEMES, type MazeTheme } from "../../../../game/maze.ts";
import { CornerGroup } from "../../../../components/CornerGroup/CornerGroup.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";
import styles from "./ToolPanel.module.css";
import { FileControls } from "../../../../editor/components/FileCodeEditor/FileControls/FileControls.tsx";
import { resizeLevel } from "../../../../game/level.ts";

const MAX_MAZE_SIZE = 50;

export function ToolPanel() {
  const { t } = useTranslation();
  const sourceApi = useLevelSource();
  const {
    name: currentLevelName,
    source: level,
    setSource: setLevel,
  } = sourceApi;
  return (
    <>
      <CornerGroup position="top-left" className={styles.cornerGroup}>
        <Button variant="highlighted" className={styles.title}>
          {currentLevelName}
        </Button>
        <FileControls sourceApi={sourceApi} />
      </CornerGroup>

      <div className={styles.separator} />

      <h5>{t("levelEditor.headers.mazeSize")}</h5>
      <FormGroup horizontal stretch>
        <FormField label={t("levelEditor.tools.width")}>
          <input
            type="number"
            value={level.maze.width}
            min={2}
            max={MAX_MAZE_SIZE}
            onChange={(e) => {
              const width = Number(e.target.value);
              setLevel(resizeLevel(level, width, level.maze.height));
            }}
          />
        </FormField>
        <FormField label={t("levelEditor.tools.height")}>
          <input
            type="number"
            value={level.maze.height}
            min={2}
            max={MAX_MAZE_SIZE}
            onChange={(e) => {
              const height = Number(e.target.value);
              setLevel(resizeLevel(level, level.maze.width, height));
            }}
          />
        </FormField>
      </FormGroup>
      <FormGroup horizontal stretch>
        <FormField label={t("levelEditor.tools.mazeTheme")}>
          <select
            value={level.maze.theme}
            onChange={(e) =>
              setLevel({
                ...level,
                maze: {
                  ...level.maze,
                  theme: e.target.value as MazeTheme,
                },
              })
            }
          >
            {MAZE_THEMES.map((theme, i) => (
              <option key={i} value={theme}>
                {t(`maze.theme.${theme}`)}
              </option>
            ))}
          </select>
        </FormField>
      </FormGroup>

      <h5>{t("levelEditor.headers.tools")}</h5>

      <ButtonGroup vertical stretch>
        {GENERAL_TOOLS.map((generalTool, i) => (
          <Button key={i} onClick={() => generalTool.onClick(level, setLevel)}>
            {tryTranslate(t, generalTool.name)}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}
