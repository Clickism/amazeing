import { Modal } from "../../../../../components/floating/Modal/Modal.tsx";
import { Button } from "../../../../../components/Button/Button.tsx";
import { BiExport } from "react-icons/bi";
import { CopyToClipboard } from "../../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";
import { useLevelSource } from "../../../../../editor/source/SourceContext.tsx";
import { Popover } from "../../../../../components/floating/Popover/Popover.tsx";
import { FormGroup } from "../../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../../components/Form/FormField/FormField.tsx";
import { stringifyToTask } from "../../../../../precourse/task.ts";
import { useState } from "react";
import {
  type Language,
  SUPPORTED_LANGUAGES,
} from "../../../../../i18n/i18n.ts";
import { PillSwitch } from "../../../../../components/PillSwitch/PillSwitch.tsx";

export function TaskExport() {
  const { t } = useTranslation();
  const { source: level, setSource: setLevel } = useLevelSource();
  const editorStateJson = stringifyToTask(level);
  const [language, setLanguage] = useState<Language>("en");
  return (
    <Popover
      title={t("levelEditor.taskExport.taskMeta")}
      noTooltip
      trigger={
        <Button variant="secondary" style={{ width: "100%" }}>
          <BiExport />
          {t("levelEditor.actions.exportTask")}
        </Button>
      }
    >
      <FormGroup>
        <PillSwitch
          layoutId="task-meta-language"
          options={SUPPORTED_LANGUAGES.map((l) => ({
            id: l,
            name: l.toUpperCase(),
          }))}
          selectedOptionId={language}
          onSelect={(id) => setLanguage(id as Language)}
        />
        <FormField label={t("levelEditor.taskExport.taskMeta.title")}>
          <input
            type="text"
            value={level.taskMeta?.title?.[language] ?? ""}
            onChange={(e) => {
              setLevel({
                ...level,
                taskMeta: {
                  ...level.taskMeta,
                  title: {
                    ...level.taskMeta?.title,
                    [language]: e.target.value,
                  },
                },
              });
            }}
            style={{
              width: "200px",
            }}
          />
        </FormField>
        <FormField label={t("levelEditor.taskExport.taskMeta.description")}>
          <textarea
            value={level.taskMeta?.description?.[language] ?? ""}
            onChange={(e) => {
              setLevel({
                ...level,
                taskMeta: {
                  ...level.taskMeta,
                  description: {
                    ...level.taskMeta?.description,
                    [language]: e.target.value,
                  },
                },
              });
            }}
            style={{
              width: "200px",
              height: "100px",
            }}
          />
        </FormField>

        <Modal
          title={t("levelEditor.taskExport.exportedJson")}
          trigger={
            <Button variant="secondary">
              <BiExport />
              {t("levelEditor.taskExport.exportJson")}
            </Button>
          }
        >
          <textarea
            readOnly
            value={editorStateJson}
            style={{
              height: "300px",
              fontFamily: "JetBrains Mono, monospace",
              whiteSpace: "pre",
              fontSize: "14px",
            }}
          />
          <CopyToClipboard content={editorStateJson} />
        </Modal>
      </FormGroup>
    </Popover>
  );
}
