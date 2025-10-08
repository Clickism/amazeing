import { ButtonGroup } from "../../ui/Button/ButtonGroup/ButtonGroup.tsx";
import { VscDebugStepOver } from "react-icons/vsc";
import { Button } from "../../ui/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type Props = {
  canStep: boolean;
  handleSteps: (steps: number) => void;
};

export function StepController({ handleSteps, canStep }: Props) {
  const [steps, setSteps] = useState(1);
  const { t } = useTranslation();
  return (
    <ButtonGroup>
      <Button
        variant={canStep ? "secondary" : "disabled"}
        disabled={!canStep}
        onClick={() => handleSteps(steps)}
      >
        <VscDebugStepOver /> {t("editor.step")}
      </Button>
      <input
        type="number"
        min={1}
        value={steps}
        onChange={(e) => setSteps(Number(e.target.value))}
        style={{
          width: "3rem"
        }}
      />
    </ButtonGroup>
  );
}
