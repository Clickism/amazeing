import { Popover } from "../../../../../components/floating/Popover/Popover.tsx";
import { IoArrowBack, IoArrowForward, IoArrowUp } from "react-icons/io5";
import { Button } from "../../../../../components/Button/Button.tsx";
import { ButtonGroup } from "../../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { useTranslation } from "react-i18next";
import { useEditorRuntime } from "../../../../runtime/EditorRuntimeContext.tsx";
import { LevelOwl } from "../../../../../game/owl.ts";
import { RxMove } from "react-icons/rx";

export function OwlControls() {
  const { t } = useTranslation();
  const { owlData, setOwlData, level } = useEditorRuntime();
  const owl = new LevelOwl(owlData, setOwlData, level);
  const canMove = owl.canMove();
  return (
    <Popover
      tooltip={t("editor.owlControls.tooltip")}
      trigger={
        <Button shape="icon">
          <RxMove size={20} />
        </Button>
      }
    >
      <ButtonGroup>
        <Button variant="outlined" onClick={() => owl.turn("left")}>
          <IoArrowBack />
          {t("editor.owlControls.left")}
        </Button>
        <Button
          disabled={!canMove}
          variant="outlined"
          onClick={() => owl.move()}
        >
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
