import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { BiImport } from "react-icons/bi";
import { Modal } from "../../../../../shared/floating/Modal/Modal.tsx";
import { FormGroup } from "../../../../../shared/components/Form/FormGroup/FormGroup.tsx";
import { useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { useLevelEditor } from "../../../context/LevelEditorContext.tsx";
import type { TaskData } from "../../../../precourse/task.ts";
import type { LevelData } from "../../../../../core/game/level.ts";
import { useFloatingContext } from "../../../../../shared/floating/FloatingContext/FloatingContext.tsx";

export function TaskImport() {
  const { t } = useTranslation();
  const [json, setJson] = useState("");
  return (
    <Modal
      title={t("levelEditor.actions.importTask")}
      noTooltip
      trigger={
        <Button style={{ width: "100%" }}>
          <BiImport /> {t("levelEditor.actions.importTask")}
        </Button>
      }
    >
      <div className="fancy-headers">
        <h5>{t("levelEditor.taskImport.json")}</h5>
        <FormGroup>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            style={{
              height: "300px",
              fontFamily: "JetBrains Mono, monospace",
              whiteSpace: "pre",
              fontSize: "14px",
            }}
          />
        </FormGroup>
        <h5>{t("levelEditor.taskImport.import.header")}</h5>
        <p
          style={{ width: "400px", color: "var(--text-color-t90)" }}
          className="flex-text"
        >
          <IoIosWarning size={50} fill="var(--clr-warning-a10)" />
          {t("levelEditor.taskImport.import.warning")}
        </p>
        <ImportButton json={json} />
      </div>
    </Modal>
  );
}

function ImportButton({ json }: { json: string }) {
  const { t } = useTranslation();
  const { setLevel } = useLevelEditor();
  const { setOpen } = useFloatingContext();

  const readJson = () => {
    try {
      const parsed = JSON.parse(json) as TaskData;
      const level: LevelData = {
        taskMeta: {
          title: parsed.title,
          description: parsed.description,
          startingCode: parsed.startingCode,
        },
        ...parsed.levelData,
      };
      setLevel(level);
      setOpen(false);
    } catch {
      alert("Invalid JSON!");
      return;
    }
  };

  return (
    <Button disabled={json === ""} style={{ width: "100%" }} onClick={readJson}>
      <BiImport />
      {t("levelEditor.taskImport.import")}
    </Button>
  );
}
