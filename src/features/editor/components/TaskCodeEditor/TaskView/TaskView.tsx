import styles from "./TaskView.module.css";
import { translateDayId } from "../../../../precourse/day.ts";
import { useTranslatable } from "../../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { TaskSelector } from "../TaskSelector/TaskSelector.tsx";
import clsx from "clsx";

export function TaskView() {
  const { t } = useTranslatable();
  const { task, days, completedTasks } = useTasks();
  const dayTitle = translateDayId(t, task.dayId);
  const taskNumber = t("day.task", { num: task.taskNumber });
  const day = days.find((d) => d.id === task.dayId)!;
  const completedTasksInDay = day.tasks.filter((t) =>
    completedTasks.includes(t.id),
  ).length;
  console.log("completedTasksInDay", completedTasksInDay);
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
        <div className={styles.dayProgressContainer}>
          <div className={styles.dayProgressTitle}>{dayTitle}</div>
          <div className={styles.verticalSeparator} />
          <div className={styles.progressBarContainer}>
            {day.tasks.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  styles.progressBar,
                  i < completedTasksInDay && styles.completed,
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <TaskSelector />
    </>
  );
}
