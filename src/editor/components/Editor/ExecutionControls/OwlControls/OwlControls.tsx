import { Popover } from "../../../../../components/floating/Popover/Popover.tsx";
import {
  IoArrowBack,
  IoArrowForward,
  IoArrowUp,
  IoMove,
} from "react-icons/io5";
import { Button } from "../../../../../components/Button/Button.tsx";
import { ButtonGroup } from "../../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { useTranslation } from "react-i18next";
import { useEditorRuntime } from "../../../../runtime/EditorRuntimeContext.tsx";

export function OwlControls() {
  const { t } = useTranslation();
  const { owl } = useEditorRuntime();
  console.log(owl)
  return (
    <Popover
      trigger={
        <Button shape="icon">
          <IoMove />
        </Button>
      }
    >
      <ButtonGroup>
        <Button variant="outlined" onClick={() => owl.turn("left")}>
          <IoArrowBack />
          {t("editor.owlControls.left")}
        </Button>
        <Button variant="outlined" onClick={() => owl.move()}>
          <IoArrowUp />
          {t("editor.owlControls.move")}
        </Button>
        <Button variant="outlined" onClick={() => owl.turn("right")}>
          <IoArrowForward />
          {t("editor.owlControls.right")}
        </Button>
      </ButtonGroup>
    </Popover>
  );
}
