import {
  type LevelEditorDispatch,
  type LevelEditorState,
  stringifyLevelData,
} from "../../../state.ts";
import { FormGroup } from "../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { CopyToClipboard } from "../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";
import { useLevelStorage } from "../../../storage/LevelStorageContext.tsx";
import { BiExport, BiImport, BiPencil, BiTrash } from "react-icons/bi";
import { TimedButton } from "../../../../components/Button/TimedButton/TimedButton.tsx";
import { Modal } from "../../../../components/floating/Modal/Modal.tsx";
import { Popover } from "../../../../components/floating/Popover/Popover.tsx";
import { useEffect, useState } from "react";
import { checkValidName, findNextName } from "../../../../editor/utils.ts";

type ExportPanelProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

// TODO: Refactor
export function ExportPanel({ editor, dispatch }: ExportPanelProps) {
  const { t } = useTranslation();
  const editorStateJSON = stringifyLevelData(editor);
  const { saveLevel, loadLevel, levelNames, renameLevel, deleteLevel } =
    useLevelStorage();
  const currentLevelName = editor.level.name ?? "Untitled";
  const [newLevelName, setNewLevelName] = useState(currentLevelName);
  const [isValid, invalidMessage] = checkValidName(
    t,
    newLevelName,
    levelNames,
    currentLevelName,
  );
  const canRename = newLevelName !== currentLevelName && isValid;

  useEffect(() => {
    setNewLevelName(currentLevelName);
  }, [currentLevelName]);

  return (
    <>
      <h5>{t("levelEditor.headers.metadata")}</h5>
      <FormGroup stretch>
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

        <Popover
          title={t("fileList.rename.action")}
          onClose={() => {
            setNewLevelName((prev) =>
              prev !== editor.level.name ? editor.level.name : prev,
            );
          }}
          trigger={
            <Button variant="outlined" shape="icon">
              <BiPencil />
            </Button>
          }
        >
          <FormGroup>
            <FormField label={t("fileList.rename.fileName")}>
              <input
                type="text"
                value={newLevelName}
                onChange={(e) => setNewLevelName(e.target.value)}
              />
            </FormField>
            <Button
              variant="primary"
              disabled={!canRename}
              onClick={() => {
                renameLevel(currentLevelName, newLevelName);
              }}
            >
              <BiPencil />
              {invalidMessage ?? t("fileList.rename.action")}
            </Button>
          </FormGroup>
        </Popover>

        <Popover
          title={t("fileList.delete.title")}
          trigger={
            <Button variant="danger" shape="icon">
              <BiTrash />
            </Button>
          }
        >
          <ButtonGroup vertical stretch>
            <div style={{ color: "var(--text-color-t90)", maxWidth: "250px" }}>
              {t("fileList.delete.confirm")}
              <br />
              <strong>{t("fileList.delete.confirm.cannotUndo")}</strong>
            </div>
            <Button
              variant="danger"
              onClick={() => {
                deleteLevel(currentLevelName);
                const nextLevelName = findNextName(
                  currentLevelName,
                  levelNames,
                );
                if (!nextLevelName) return;
                const nextLevel = loadLevel(nextLevelName);
                if (nextLevel) {
                  dispatch({ type: "setLevel", level: nextLevel });
                }
              }}
            >
              <BiTrash />
              {t("fileList.delete.action", { file: currentLevelName })}
            </Button>
          </ButtonGroup>
        </Popover>
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
            saveLevel(editor.level);
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
