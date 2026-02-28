import { Modal } from "../../../../../shared/floating/Modal/Modal.tsx";
import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { BiExport } from "react-icons/bi";
import { CopyToClipboard } from "../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";
import { FormGroup } from "../../../../../shared/components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../../shared/components/Form/FormField/FormField.tsx";
import { stringifyToTask } from "../../../../precourse/task.ts";
import { useState } from "react";
import {
  type Language,
  SUPPORTED_LANGUAGES,
} from "../../../../../shared/i18n/i18n.ts";
import { PillSwitch } from "../../../../../shared/components/PillSwitch/PillSwitch.tsx";
import { useLevelEditor } from "../../../context/LevelEditorContext.tsx";
import { MiniCodeEditor } from "../../../../editor/components/CodeEditor/MiniCodeEditor/MiniCodeEditor.tsx";

export function TaskExport() {
  const { t } = useTranslation();
  const { level, setLevel } = useLevelEditor();
  const editorStateJson = stringifyToTask(level);
  const [language, setLanguage] = useState<Language>("en");
  return (
    <Modal
      title={t("levelEditor.actions.exportTask")}
      noTooltip
      trigger={
        <Button variant="secondary" style={{ width: "100%" }}>
          <BiExport />
          {t("levelEditor.actions.exportTask")}
        </Button>
      }
    >
      <div className="fancy-headers">
        <h5>{t("levelEditor.taskExport.taskMeta")}</h5>
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
        </FormGroup>
        <h5>{t("levelEditor.taskExport.other")}</h5>
        <FormGroup>
          <FormField label={t("levelEditor.taskExport.startingCode")}>
            <MiniCodeEditor
              code={level.taskMeta?.startingCode ?? ""}
              setCode={(code) => {
                setLevel({
                  ...level,
                  taskMeta: {
                    ...level.taskMeta,
                    startingCode: code,
                  },
                });
              }}
              editorProps={{ autocomplete: false }}
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
      </div>
    </Modal>
  );
}
