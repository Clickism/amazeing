import { FormGroup } from "../../../../components/ui/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/ui/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/ui/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/ui/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import type { LevelEditorDispatch, LevelEditorState } from "../../../state.ts";
import { GENERAL_TOOLS, TILE_TOOLS, WALL_TOOLS } from "../../../tools.tsx";
import { tryTranslate } from "../../../../i18n/i18n.ts";

type ToolPanelProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

const MAX_MAZE_SIZE = 50;

export function ToolPanel({ editor, dispatch }: ToolPanelProps) {
  const { t } = useTranslation();
  return (
    <>
      <h4>{t("levelEditor.title") + " 🎨"}</h4>

      <h5>{t("levelEditor.headers.mazeSize")}</h5>
      <FormGroup horizontal stretch>
        <FormField label={t("levelEditor.tools.width")}>
          <input
            type="number"
            value={editor.width}
            min={2}
            max={MAX_MAZE_SIZE}
            onChange={(e) => {
              const width = Number(e.target.value);
              dispatch({
                type: "resize",
                width: width,
                height: editor.height,
              });
            }}
          />
        </FormField>
        <FormField label={t("levelEditor.tools.height")}>
          <input
            type="number"
            value={editor.height}
            min={2}
            max={MAX_MAZE_SIZE}
            onChange={(e) => {
              const height = Number(e.target.value);
              dispatch({
                type: "resize",
                width: editor.width,
                height: height,
              });
            }}
          />
        </FormField>
      </FormGroup>

      <h5>{t("levelEditor.headers.tileTool")}</h5>

      <ButtonGroup vertical stretch>
        {TILE_TOOLS.map((tileTool, i) => (
          <Button
            key={i}
            variant={editor.tileTool === tileTool ? "secondary" : "outlined"}
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
            variant={editor.wallTool === wallTool ? "secondary" : "outlined"}
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
