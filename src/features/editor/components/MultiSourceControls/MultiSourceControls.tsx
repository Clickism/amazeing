import { Button } from "../../../../shared/components/Button/Button.tsx";
import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Popover } from "../../../../shared/components/floating/Popover/Popover.tsx";
import { FormField } from "../../../../shared/components/Form/FormField/FormField.tsx";
import { FormGroup } from "../../../../shared/components/Form/FormGroup/FormGroup.tsx";
import { useEffect, useState } from "react";
import { checkValidName } from "../../utils.ts";
import { type MultiSource } from "../../context/source/source.ts";

type MultiSourceControlsProps<T> = {
  source: MultiSource<T>;
};

export function MultiSourceControls<T>({
  source: {
    sourceNames,
    activeSource: { name: activeSource },
    renameSource,
    deleteSource,
  },
}: MultiSourceControlsProps<T>) {
  const { t } = useTranslation();
  const [newSourceName, setNewSourceName] = useState(activeSource);

  const [isValid, invalidMessage] = checkValidName(
    t,
    newSourceName,
    sourceNames,
    activeSource,
  );
  const canRename = newSourceName !== activeSource && isValid;

  useEffect(() => {
    setNewSourceName(activeSource);
  }, [activeSource]);

  return (
    <ButtonGroup style={{ flexWrap: "nowrap" }}>
      <Popover
        title={t("fileList.rename.action")}
        onClose={() => setNewSourceName(activeSource)}
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
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
            />
          </FormField>
          <Button
            variant="primary"
            disabled={!canRename}
            onClick={() => {
              renameSource(newSourceName);
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
            {t("fileList.delete.action", { file: activeSource })}
          </Button>
        </ButtonGroup>
      </Popover>
    </ButtonGroup>
  );
}
