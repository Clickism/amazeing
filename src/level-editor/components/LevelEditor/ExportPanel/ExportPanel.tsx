import {
  type LevelEditorDispatch,
  type LevelEditorState,
  stringifyLevelData,
} from "../../../state.ts";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { CopyToClipboard } from "../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";
import { BiExport, BiImport } from "react-icons/bi";
import { TimedButton } from "../../../../components/Button/TimedButton/TimedButton.tsx";
import { Modal } from "../../../../components/floating/Modal/Modal.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";

type ExportPanelProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

// TODO: Refactor
export function ExportPanel({ editor, dispatch }: ExportPanelProps) {
  const { t } = useTranslation();
  const editorStateJSON = stringifyLevelData(editor);
  const { saveSource } = useLevelSource();

  return (
    <>
      <h5>{t("levelEditor.headers.metadata")}</h5>
      {/*<FormField label={t("levelEditor.export.levelTitle")}>*/}
      {/*  <input*/}
      {/*    type="text"*/}
      {/*    value={editor.level.title}*/}
      {/*    onChange={(e) => {*/}
      {/*      dispatch({*/}
      {/*        type: "setMetadata",*/}
      {/*        name: currentLevelName,*/}
      {/*        title: e.target.value,*/}
      {/*        description: editor.level.description,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      width: "200px",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</FormField>*/}

      {/*<FormField label={t("levelEditor.export.levelDescription")}>*/}
      {/*  <textarea*/}
      {/*    value={editor.level.description}*/}
      {/*    onChange={(e) => {*/}
      {/*      dispatch({*/}
      {/*        type: "setMetadata",*/}
      {/*        name: currentLevelName,*/}
      {/*        title: editor.level.title,*/}
      {/*        description: e.target.value,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      height: "100px",*/}
      {/*      width: "200px",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</FormField>*/}

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
            saveSource(editor.level);
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
