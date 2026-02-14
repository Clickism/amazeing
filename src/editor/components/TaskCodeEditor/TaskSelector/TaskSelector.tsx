import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../../i18n/i18n.ts";
import { translateDayId } from "../../../../precourse/day.ts";
import { List } from "../../../../components/List/List.tsx";

export function TaskSelector() {
  const { t } = useTranslatable();
  const { task: currentTask, setTaskId, days } = useTasks();
  return (
    <List
      elements={days.map((day) => ({
        id: day.id,
        name: translateDayId(t, day.id),
        elements: day.tasks.map((task) => ({
          id: task.id,
          name: t("day.task", { num: task.taskNumber }),
        })),
      }))}
      activeElementId={currentTask.id}
      onSelectElement={(task) => setTaskId(task)}
      openGroupIds={[currentTask.dayId]}
      layoutId="task-selector-indicator"
    />
  );
}
