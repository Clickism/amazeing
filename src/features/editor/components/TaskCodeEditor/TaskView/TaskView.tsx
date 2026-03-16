import styles from "./TaskView.module.css";
import { translateDayId } from "../../../../precourse/day.ts";
import { useTranslatable } from "../../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { TaskSelector } from "../TaskSelector/TaskSelector.tsx";
import clsx from "clsx";
import { ConstraintsView } from "./ConstraintsView/ConstraintsView.tsx";
import { useInterpreter } from "../../../context/interpreter/InterpreterContext.tsx";
import { TaskDescription } from "./TaskDescription/TaskDescription.tsx";
import { motion } from "motion/react";

export function TaskView() {
  const { t } = useTranslatable();
  const { task, days, completedTasks } = useTasks();
  const { constraints } = useInterpreter();
  const dayTitle = translateDayId(t, task.dayId);
  const taskNumber = t("day.task", { num: task.taskNumber });
  const day = days.find((d) => d.id === task.dayId)!;
  const completedTasksInDay = day.tasks.filter((t) =>
    completedTasks.includes(t.id),
  ).length;
  return (
    <motion.div className={styles.container} layout>
      <motion.div
        className={styles.currentTaskContainer}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 50 }}
      >
        <div className={styles.dayTask}>
          {dayTitle}: {taskNumber}
        </div>
        <div className={styles.separator} />
        <div className={styles.title}>{t(task.title)}</div>
        <div className={styles.separator} />
        <div className={styles.description}>
          <TaskDescription description={t(task.description)} />
        </div>
        {constraints && (
          <>
            <div className={styles.separator} />
            <ConstraintsView constraints={constraints} />
            <div className={styles.separator} />
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
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div
        className={styles.taskSelectorContainer}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 50 }}
      >
        <TaskSelector />
      </motion.div>
    </motion.div>
  );
}
