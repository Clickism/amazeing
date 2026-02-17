import { FormGroup } from "../../../../../../shared/components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../../../shared/components/Form/FormField/FormField.tsx";
import { resizeLevel } from "../../../../../../core/game/level.ts";
import { MAZE_THEMES, type MazeTheme } from "../../../../../../core/game/maze.ts";
import { useTranslation } from "react-i18next";
import { useLevelEditor } from "../../../../context/LevelEditorContext.tsx";

const MAX_MAZE_SIZE = 50;

export function MazeProperties() {
  const { t } = useTranslation();
  const { level, setLevel } = useLevelEditor();
  return (
    <>
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
    </>
  );
}
