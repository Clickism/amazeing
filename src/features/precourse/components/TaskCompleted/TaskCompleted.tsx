import { useTranslation } from "react-i18next";
import { Button } from "../../../../shared/components/Button/Button.tsx";
import { ButtonGroup } from "../../../../shared/components/Button/ButtonGroup/ButtonGroup.tsx";
import { FaArrowRight } from "react-icons/fa6";
import type { Task } from "../../task.ts";
import type { Day } from "../../day.ts";
import type { ModalContext } from "../../../../shared/floating/context/ModalContext.tsx";
import { ConstraintsView } from "../../../editor/components/TaskCodeEditor/TaskView/ConstraintsView/ConstraintsView.tsx";

type TaskCompletedProps = {
  task: Task;
  days: Day[];
  setTaskId: (id: string) => void;
  modal: ModalContext;
};

export function TaskCompleted({
  task,
  days,
  setTaskId,
  modal,
}: TaskCompletedProps) {
  const { t } = useTranslation();
  // Set up modal props
  modal.setProps({
    title: t("taskCompleted.title"),
    maxWidth: 600,
  });
  // Find next task
  const currentDayIdx = days.findIndex((d) => d.id === task.dayId);
  const currentDay = days[currentDayIdx];
  const currentTaskIdx = currentDay.tasks.findIndex((t) => t.id === task.id);
  const nextTaskIdx = currentTaskIdx + 1;
  const nextTask =
    nextTaskIdx >= 0 && nextTaskIdx < currentDay.tasks.length
      ? currentDay.tasks[nextTaskIdx]
      : null;
  const nextDayIndex = currentDayIdx + 1;
  const nextDay = nextDayIndex >= 0 ? days[nextDayIndex] : null;
  return (
    <>
      <div className="fancy-headers">
        {task.constraints
          ? t("taskCompleted.descriptionConstraints")
          : t("taskCompleted.description")}
        {task.constraints && (
          <div style={{ marginTop: ".5rem" }}>
            <ConstraintsView
              open={true}
              showTooltip={false}
              constraints={task.constraints.map((c) => ({ ...c, met: true }))}
            />
          </div>
        )}
        <h5>{t("taskCompleted.continue")}</h5>
        <div>
          {nextTask
            ? t("taskCompleted.continue.task")
            : nextDay
              ? t("taskCompleted.continue.day")
              : t("taskCompleted.continue.noMoreTasks")}
        </div>
      </div>
      <ButtonGroup stretch>
        <Button
          onClick={() => {
            modal.setOpen(false);
          }}
        >
          {t("taskCompleted.stayOnTask", { task: task.taskNumber })}
        </Button>
        {nextTask && (
          <Button
            variant="success"
            onClick={() => {
              setTaskId(nextTask.id);
              modal.setOpen(false);
            }}
          >
            {t("taskCompleted.nextTask")}
            <FaArrowRight />
          </Button>
        )}
      </ButtonGroup>
    </>
  );
}
