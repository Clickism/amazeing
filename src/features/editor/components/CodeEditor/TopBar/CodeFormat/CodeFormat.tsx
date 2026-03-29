import { Button } from "../../../../../../shared/components/Button/Button.tsx";
import { LuWandSparkles } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useCodeModel } from "../../../../context/code/CodeModelContext.tsx";
import { Tooltip } from "../../../../../../shared/floating/components/Tooltip/Tooltip.tsx";
import formatCode from "../../../../../../core/amazeing/format.ts";

export function CodeFormat() {
  const { t } = useTranslation();
  const { code, setCode } = useCodeModel();
  const handleFormat = () => {
    setCode(formatCode(code));
  }
  return (
    <Tooltip content={t("codeEditor.formatCode")}>
      <Button shape="icon" variant="secondary" onClick={handleFormat}>
        <LuWandSparkles size={22} />
      </Button>
    </Tooltip>
  );
}
