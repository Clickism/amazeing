import { Popover } from "../../../../../../shared/components/floating/Popover/Popover.tsx";
import { IoArrowBack, IoArrowForward, IoArrowUp } from "react-icons/io5";
import { Button } from "../../../../../../shared/components/Button/Button.tsx";
import { ButtonGroup } from "../../../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { useTranslation } from "react-i18next";
import { useInterpreter } from "../../../../context/interpreter/InterpreterContext.tsx";
import { LevelOwl } from "../../../../../../core/game/owl.ts";
import { RxMove } from "react-icons/rx";

export function OwlControls() {
  const { t } = useTranslation();
  const { owlData, setOwlData, level } = useInterpreter();
  const owl = new LevelOwl(() => owlData, setOwlData, level);
  const canMove = owl.canMove() && !level.isOwlAtFinish(owlData);
  const canTurn = !level.isOwlAtFinish(owlData);
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
        <Button disabled={!canTurn} onClick={() => owl.turn("left")}>
          <IoArrowBack />
          {t("editor.owlControls.left")}
        </Button>
        <Button disabled={!canMove} onClick={() => owl.move()}>
          <IoArrowUp />
          {t("editor.owlControls.move")}
        </Button>
        <Button disabled={!canTurn} onClick={() => owl.turn("right")}>
          <IoArrowForward />
          {t("editor.owlControls.right")}
        </Button>
      </ButtonGroup>
    </Popover>
  );
}
