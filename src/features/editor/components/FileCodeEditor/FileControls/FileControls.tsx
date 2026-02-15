import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { ButtonGroup } from "../../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Popover } from "../../../../../shared/components/floating/Popover/Popover.tsx";
import { FormField } from "../../../../../shared/components/Form/FormField/FormField.tsx";
import { FormGroup } from "../../../../../shared/components/Form/FormGroup/FormGroup.tsx";
import { useEffect, useState } from "react";
import { type SourceAPI } from "../../../source/SourceContext.tsx";
import { checkValidName } from "../../../utils.ts";

type FileControlsProps<T> = {
  sourceApi: SourceAPI<T>;
};

export function FileControls<T>({ sourceApi }: FileControlsProps<T>) {
  const { t } = useTranslation();
  const {
    name: activeFile,
    renameSource,
    deleteSource,
    sourceNames,
  } = sourceApi;
  const [newFileName, setNewFileName] = useState(activeFile);
  const [isValid, invalidMessage] = checkValidName(
    t,
    newFileName,
    sourceNames ?? [],
    activeFile,
  );
  const canRename = newFileName !== activeFile && isValid;

  useEffect(() => {
    setNewFileName(activeFile);
  }, [activeFile]);

  return (
    <ButtonGroup>
      <Popover
        title={t("fileList.rename.action")}
        onClose={() => setNewFileName(activeFile)}
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
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
          </FormField>
          <Button
            variant="primary"
            disabled={!canRename}
            onClick={() => {
              renameSource(newFileName);
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
          <Button variant="danger" onClick={() => deleteSource()}>
            <BiTrash />
            {t("fileList.delete.action", { file: activeFile })}
          </Button>
        </ButtonGroup>
      </Popover>
    </ButtonGroup>
  );
}
