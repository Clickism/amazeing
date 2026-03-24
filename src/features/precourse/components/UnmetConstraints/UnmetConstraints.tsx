import type { ModalContext } from "../../../../shared/floating/context/ModalContext.tsx";
import type { EvaluatedConstraint } from "../../../../core/game/constraints.ts";
import { useTranslation } from "react-i18next";
import { BiSolidError } from "react-icons/bi";
import { ConstraintsView } from "../../../editor/components/TaskCodeEditor/TaskView/ConstraintsView/ConstraintsView.tsx";
import { Button } from "../../../../shared/components/Button/Button.tsx";
import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { TbArrowBackUp } from "react-icons/tb";
import { useEffect } from "react";

type UnmetConstraintsProps = {
  modal: ModalContext;
  constraints: EvaluatedConstraint[];
};

export function UnmetConstraints({
  modal,
  constraints,
}: UnmetConstraintsProps) {
  const { t } = useTranslation();
  // Set up modal props
  useEffect(() => {
    modal.setProps({
      title: (
        <div className="flex-text" style={{ color: "var(--clr-danger-a10)" }}>
          <BiSolidError />
          {t("unmetConstraints.title")}
        </div>
      ),
      maxWidth: 500,
    });
  }, []);
  return (
    <>
      <div className="fancy-headers">
        <div style={{ color: "var(--text-color-t90)" }}>
          {t("unmetConstraints.description")}
        </div>
        <div style={{ marginTop: ".5rem" }}>
          <ConstraintsView
            open={true}
            showTooltip={false}
            constraints={constraints}
          />
        </div>
        <h5>{t("unmetConstraints.continue")}</h5>
        <ButtonGroup stretch>
          <Button
            onClick={() => {
              modal.setOpen(false);
            }}
          >
            <TbArrowBackUp size={20} />
            {t("unmetConstraints.checkSolution")}
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}
