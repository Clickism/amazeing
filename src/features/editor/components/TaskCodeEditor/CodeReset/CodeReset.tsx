import { Popover } from "../../../../../shared/floating/Popover/Popover.tsx";
import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { LuListRestart } from "react-icons/lu";
import { ButtonGroup } from "../../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { useTranslation } from "react-i18next";
import { useCodeModel } from "../../../context/code/CodeModelContext.tsx";
import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { useFloatingContext } from "../../../../../shared/floating/FloatingContext/FloatingContext.tsx";

export function CodeReset() {
  const { t } = useTranslation();
  return (
    <Popover
      title={t("codeEditor.resetCode")}
      trigger={
        <Button shape="icon" variant="danger">
          <LuListRestart size={22} />
        </Button>
      }
    >
      <ButtonGroup vertical stretch>
        <div style={{ color: "var(--text-color-t90)", maxWidth: "250px" }}>
          {t("codeEditor.resetCode.confirm")}
          <br />
          <strong>{t("codeEditor.resetCode.confirm.cannotUndo")}</strong>
        </div>
        <ResetButton />
      </ButtonGroup>
    </Popover>
  );
}

function ResetButton() {
  const { t } = useTranslation();
  const { setCode } = useCodeModel();
  const { task } = useTasks();
  const { setOpen } = useFloatingContext();
  const handleReset = () => {
    setCode(task.startingCode ?? t("codeStorage.newFile.content"));
    setOpen(false);
  };
  return (
    <Button variant="danger" onClick={handleReset}>
      <LuListRestart size={22} />
      {t("codeEditor.resetCode")}
    </Button>
  );
}
