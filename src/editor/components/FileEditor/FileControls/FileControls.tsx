import { Button } from "../../../../components/Button/Button.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Popover } from "../../../../components/popup/Popover/Popover.tsx";
import { FormField } from "../../../../components/Form/FormField/FormField.tsx";
import { FormGroup } from "../../../../components/Form/FormGroup/FormGroup.tsx";
import { useState } from "react";
import { useSource } from "../../../source/SourceContext.tsx";

const MAX_FILE_NAME_LENGTH = 32;

export function FileControls() {
  const { t } = useTranslation();
  const { name: activeFile, renameSource, deleteSource } = useSource();
  const [newFileName, setNewFileName] = useState(activeFile);
  const isValid =
    newFileName.length > 0 && newFileName.length <= MAX_FILE_NAME_LENGTH;
  const canRename = newFileName !== activeFile && isValid;
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
            {t("fileList.rename.action")}
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
