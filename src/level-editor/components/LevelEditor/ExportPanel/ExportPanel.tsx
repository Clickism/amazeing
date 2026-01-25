import {
  type LevelEditorDispatch,
  type LevelEditorState,
  stringifyLevelData,
  toLevelData,
} from "../../../state.ts";
import { FormGroup } from "../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { CopyToClipboard } from "../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";
import { useLevelStorage } from "../../../../game/storage/LevelStorageContext.tsx";
import { BiExport, BiImport } from "react-icons/bi";
import { TimedButton } from "../../../../components/Button/TimedButton/TimedButton.tsx";
import { Modal } from "../../../../components/floating/Modal/Modal.tsx";

type ExportPanelProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

export function ExportPanel({ editor, dispatch }: ExportPanelProps) {
  const { t } = useTranslation();
  const editorStateJSON = stringifyLevelData(editor);
  const { addLevel } = useLevelStorage();
  return (
    <>
      <h4 className="flex-text">
        {t("levelEditor.export.export")} <BiExport />
      </h4>
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
          // TODO: Translate
          title={t("levelEditor.export.actions.exportJSON.modal")}
          trigger={
            <Button variant="secondary">
              {t("levelEditor.export.actions.exportJSON")}
              <BiExport />
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

        <TimedButton
          variant="secondary"
          onClick={() => {
            addLevel(toLevelData(editor));
          }}
        >
          {(active) =>
            active ? (
              <strong>{t("button.saved")}</strong>
            ) : (
              <>
                {t("levelEditor.export.actions.saveCustomLevel")}
                <BiImport />
              </>
            )
          }
        </TimedButton>

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
