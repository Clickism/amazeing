import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { useTranslatable } from "../../../../../shared/i18n/i18n.ts";
import { translateDayId } from "../../../../precourse/day.ts";
import { List } from "../../../../../shared/components/List/List.tsx";
import styles from "./TaskSelector.module.css";
import clsx from "clsx";

export function TaskSelector() {
  const { t } = useTranslatable();
  const { task: currentTask, setTaskId, days, completedTasks } = useTasks();
  return (
    <List
      elements={days.map((day) => ({
        id: day.id,
        name: translateDayId(t, day.id),
        elements: day.tasks.map((task) => ({
          id: task.id,
          name: (
            <div
              className={clsx(
                completedTasks.includes(task.id) && styles.completed,
              )}
            >
              {t("day.task", { num: task.taskNumber })}
            </div>
          ),
        })),
      }))}
      activeElementId={currentTask.id}
      onSelectElement={(task) => setTaskId(task)}
      openGroupIds={[currentTask.dayId]}
      layoutId="task-selector-indicator"
    />
  );
}
