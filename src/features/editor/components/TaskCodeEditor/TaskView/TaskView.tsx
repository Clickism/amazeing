import styles from "./TaskView.module.css";
import { translateDayId } from "../../../../precourse/day.ts";
import { useTranslatable } from "../../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { TaskSelector } from "../TaskSelector/TaskSelector.tsx";
import clsx from "clsx";
import type { EvaluatedConstraint } from "../../../../../core/game/constraints.ts";

export function TaskView() {
  const { t } = useTranslatable();
  const { task, days, completedTasks, partiallyCompletedTasks } = useTasks();
  const dayTitle = translateDayId(t, task.dayId);
  const taskNumber = t("day.task", { num: task.taskNumber });
  const day = days.find((d) => d.id === task.dayId)!;
  const completedTasksInDay =
    day.tasks.filter((t) => completedTasks.includes(t.id)).length;
  const partiallyCompletedTasksInDay =
    day.tasks.filter((t) => partiallyCompletedTasks[t.id] !== undefined).length;
  const constraints: EvaluatedConstraint[] = partiallyCompletedTasks[task.id] ||
    task.constraints || [];
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
        {task.constraints && (
          <>
            <div className={styles.separator} />
            <div className={styles.constraints}>
              <h3 className={styles.constraintsTitle}>
                {t("taskView.constraints.title")}
              </h3>
              <div className={styles.constraintsExplanation}>
                {t("taskView.constraints.explanation")}
              </div>
              <ul className={styles.constraintsList}>
                {constraints?.map((constraint, i) => (
                  <li
                    key={i}
                    className={clsx(
                      styles.constraint,
                      (constraint.met || completedTasks.includes(task.id)) && styles.constraintMet,
                      // This could also be undefined if the constraint hasn't been evaluated yet
                      constraint.met === false && styles.constraintUnmet,
                    )}
                  >
                    {t(`constraints.${constraint.type}`, {
                      ...constraint,
                      allowed: constraint.type === "allowed-instructions"
                        ? constraint.allowed.join(", ")
                        : undefined,
                    })}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
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
                  i >= completedTasksInDay &&
                    i < completedTasksInDay + partiallyCompletedTasksInDay &&
                    styles.partial,
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
