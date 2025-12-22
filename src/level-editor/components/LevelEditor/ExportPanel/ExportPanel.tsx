import {
  type EditorDispatch,
  type EditorState,
  stringifyEditorState,
} from "../../../state.ts";
import { FormGroup } from "../../../../components/ui/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/ui/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/ui/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/ui/Button/Button.tsx";
import { Modal } from "../../../../components/ui/Modal/Modal.tsx";
import { CopyToClipboard } from "../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";

type ExportPanelProps = {
  editor: EditorState;
  dispatch: EditorDispatch;
};

export function ExportPanel({ editor, dispatch }: ExportPanelProps) {
  const { t } = useTranslation();
  const editorStateJSON = stringifyEditorState(editor);
  return (
    <>
      <h4>{t("levelEditor.export.export") + " 📤"}</h4>
      <h5>{t("levelEditor.headers.metadata")}</h5>
      <FormGroup stretch>
        <FormField label={t("levelEditor.export.levelName")}>
          <input
            type="text"
            value={editor.name}
            onChange={(e) => {
              dispatch({
                type: "setMetadata",
                name: e.target.value,
                description: editor.description,
              });
            }}
            style={{
              width: "200px",
            }}
          />
        </FormField>
        <FormField label={t("levelEditor.export.levelDescription")}>
          <textarea
            value={editor.description}
            onChange={(e) => {
              dispatch({
                type: "setMetadata",
                name: editor.name,
                description: e.target.value,
              });
            }}
            style={{
              height: "100px",
              width: "200px",
            }}
          />
        </FormField>
      </FormGroup>

      <h5>{t("levelEditor.headers.actions")}</h5>

      <ButtonGroup vertical stretch>
        <Button
          variant="success"
          onClick={() => dispatch({ type: "toggleVisualize" })}
        >
          {editor.visualize
            ? t("levelEditor.export.actions.editMaze")
            : t("levelEditor.export.actions.visualizeMaze")}
        </Button>
        <Modal
          title={"Exported Level JSON"}
          trigger={
            <Button variant="primary">
              {t("levelEditor.export.actions.exportJSON")}
            </Button>
          }
        >
          <textarea
            readOnly
            value={editorStateJSON}
            style={{
              height: "200px",
            }}
          />
          <CopyToClipboard content={editorStateJSON} />
        </Modal>

        <Button
          variant="danger"
          onClick={() => {
            dispatch({ type: "reset" });
          }}
        >
          {t("levelEditor.export.actions.reset")}
        </Button>
      </ButtonGroup>
    </>
  );
}
