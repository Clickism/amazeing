import styles from "./TaskView.module.css";
import { translateDayId } from "../../../../precourse/day.ts";
import { useTranslatable } from "../../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { TaskSelector } from "../TaskSelector/TaskSelector.tsx";

export function TaskView() {
  const { t } = useTranslatable();
  const { task } = useTasks();
  const dayTitle = translateDayId(t, task.dayId);
  const taskNumber = t("day.task", { num: task.taskNumber });
  return (
    <>
      <div className={styles.currentTaskContainer}>
        <div className={styles.dayTask}>
          {dayTitle}: {taskNumber}
        </div>
        <div className={styles.separator} />
        <div className={styles.title}>{t(task.title)}</div>
        <div className={styles.separator} />
        <div className={styles.description}>{t(task.description)}</div>
      </div>
      <TaskSelector />
    </>
  );
}
