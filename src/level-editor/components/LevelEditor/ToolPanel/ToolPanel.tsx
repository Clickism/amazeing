import { FormGroup } from "../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import type { LevelEditorDispatch, LevelEditorState } from "../../../state.ts";
import { GENERAL_TOOLS } from "../../../tools.tsx";
import { tryTranslate } from "../../../../i18n/i18n.ts";
import { MAZE_THEMES, type MazeTheme } from "../../../../game/maze.ts";
import { CornerGroup } from "../../../../components/CornerGroup/CornerGroup.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";
import { Popover } from "../../../../components/floating/Popover/Popover.tsx";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useEffect, useState } from "react";
import { checkValidName } from "../../../../editor/utils.ts";
import styles from "./ToolPanel.module.css";

type ToolPanelProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

const MAX_MAZE_SIZE = 50;

export function ToolPanel({ editor, dispatch }: ToolPanelProps) {
  const { t } = useTranslation();
  const {
    name: currentLevelName,
    sourceNames: levelNames,
    renameSource,
    deleteSource,
  } = useLevelSource();
  const [newLevelName, setNewLevelName] = useState(currentLevelName);
  const [isValid, invalidMessage] = checkValidName(
    t,
    newLevelName,
    levelNames ?? [],
    currentLevelName,
  );
  const canRename = newLevelName !== currentLevelName && isValid;

  useEffect(() => {
    setNewLevelName(currentLevelName);
  }, [currentLevelName]);
  return (
    <>
      <CornerGroup position="top-left" className={styles.cornerGroup}>
        <Button variant="highlighted" className={styles.title}>
          {currentLevelName}
        </Button>
        <Popover
          title={t("fileList.rename.action")}
          onClose={() => {
            setNewLevelName((prev) =>
              prev !== currentLevelName ? currentLevelName : prev,
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
                renameSource(newLevelName);
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
                deleteSource();
              }}
            >
              <BiTrash />
              {t("fileList.delete.action", { file: currentLevelName })}
            </Button>
          </ButtonGroup>
        </Popover>
      </CornerGroup>

      <div className={styles.separator} />

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
      <FormGroup horizontal stretch>
        <FormField label={t("levelEditor.tools.mazeTheme")}>
          <select
            value={editor.level.maze.theme}
            onChange={(e) =>
              dispatch({
                type: "setMazeTheme",
                theme: e.target.value as MazeTheme,
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
          <Button key={i} onClick={() => generalTool.onClick(editor, dispatch)}>
            {tryTranslate(t, generalTool.name)}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}
