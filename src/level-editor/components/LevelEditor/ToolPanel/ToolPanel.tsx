import { FormGroup } from "../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import type { LevelEditorDispatch, LevelEditorState } from "../../../state.ts";
import { GENERAL_TOOLS, TILE_TOOLS, WALL_TOOLS } from "../../../tools.tsx";
import { tryTranslate } from "../../../../i18n/i18n.ts";
import { RiToolsFill } from "react-icons/ri";
import { TILE_TYPES, type TileType } from "../../../../game/maze.ts";

type ToolPanelProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

const MAX_MAZE_SIZE = 50;

export function ToolPanel({ editor, dispatch }: ToolPanelProps) {
  const { t } = useTranslation();
  return (
    <>
      <h4 className="flex-text">
        {t("levelEditor.title")} <RiToolsFill size={20} />
      </h4>

      <h5>{t("levelEditor.headers.mazeSize")}</h5>
      <FormGroup horizontal stretch>
        <FormField label={t("levelEditor.tools.width")}>
          <input
            type="number"
            value={editor.level.maze.width}
            min={2}
            max={MAX_MAZE_SIZE}
            onChange={(e) => {
              const width = Number(e.target.value);
              dispatch({
                type: "resize",
                width: width,
                height: editor.level.maze.height,
              });
            }}
          />
        </FormField>
        <FormField label={t("levelEditor.tools.height")}>
          <input
            type="number"
            value={editor.level.maze.height}
            min={2}
            max={MAX_MAZE_SIZE}
            onChange={(e) => {
              const height = Number(e.target.value);
              dispatch({
                type: "resize",
                width: editor.level.maze.width,
                height: height,
              });
            }}
          />
        </FormField>
      </FormGroup>

      <h5>{t("levelEditor.headers.theme")}</h5>
      <FormGroup horizontal stretch>
        <FormField label={t("levelEditor.tools.tileType")}>
          <select
            value={editor.level.maze.tileType}
            onChange={(e) =>
              dispatch({
                type: "setTileType",
                tileType: e.target.value as TileType,
              })
            }
          >
            {TILE_TYPES.map((tileType, i) => (
              <option key={i} value={tileType}>
                {t(`tile.${tileType}`)}
              </option>
            ))}
          </select>
        </FormField>
      </FormGroup>

      <h5>{t("levelEditor.headers.tileTool")}</h5>

      <ButtonGroup vertical stretch>
        {TILE_TOOLS.map((tileTool, i) => (
          <Button
            key={i}
            variant={editor.tileTool === tileTool ? "secondary" : "transparent"}
            border={editor.tileTool === tileTool ? "active" : "default"}
            onClick={() => dispatch({ type: "setTileTool", tileTool })}
          >
            {tryTranslate(t, tileTool.name)}
          </Button>
        ))}
      </ButtonGroup>

      <h5>{t("levelEditor.headers.wallTool")}</h5>

      <ButtonGroup vertical stretch>
        {WALL_TOOLS.map((wallTool, i) => (
          <Button
            key={i}
            variant={editor.wallTool === wallTool ? "secondary" : "transparent"}
            border={editor.wallTool === wallTool ? "active" : "default"}
            onClick={() => dispatch({ type: "setWallTool", wallTool })}
          >
            {tryTranslate(t, wallTool.name)}
          </Button>
        ))}
      </ButtonGroup>

      <h5>{t("levelEditor.headers.tools")}</h5>

      <ButtonGroup vertical stretch>
        {GENERAL_TOOLS.map((generalTool, i) => (
          <Button key={i} onClick={() => generalTool.onClick(editor, dispatch)}>
            {tryTranslate(t, generalTool.name)}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}
