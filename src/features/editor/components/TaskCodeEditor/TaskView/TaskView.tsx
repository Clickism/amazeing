import styles from "./TaskView.module.css";
import { translateDayId } from "../../../../precourse/day.ts";
import { useTranslatable } from "../../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../../precourse/context/TasksContext.tsx";
import { TaskSelector } from "../TaskSelector/TaskSelector.tsx";
import clsx from "clsx";
import { ConstraintsView } from "./ConstraintsView/ConstraintsView.tsx";
import { TaskDescription } from "./TaskDescription/TaskDescription.tsx";
import { motion } from "motion/react";
import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { MdDoneAll } from "react-icons/md";
import { useConstraints } from "../../../context/interpreter/ConstraintsContext.tsx";
import { memo } from "react";

export const TaskView = memo(function TaskView() {
  const { t } = useTranslatable();
  const { task, days, completedTasks, setCompleted } = useTasks();
  const { constraints } = useConstraints();
  const dayTitle = translateDayId(t, task.dayId);
  const taskNumber = t("day.task", { num: task.taskNumber });
  const day = days.find((d) => d.id === task.dayId)!;
  const completedTasksInDay = day.tasks.filter((t) =>
    completedTasks.includes(t.id),
  ).length;
  const isCompleted = completedTasks.includes(task.id);
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

        {/*Task description*/}
        <div className={styles.description}>
          <TaskDescription description={t(task.description)} />
        </div>

        {/*Constraints*/}
        {constraints && (
          <>
            <div className={styles.separator} />
            <ConstraintsView constraints={constraints} />
            <div className={styles.separator} />
          </>
        )}

        {/*Self check*/}
        {task.selfChecked && !isCompleted && (
          <>
            <div className={styles.separator} />
            <div className={styles.description}>
              {t("tasks.selfChecked.explanation")}
            </div>
            <Button
              variant="success"
              onClick={() => {
                setCompleted(task.id, true);
              }}
            >
              <MdDoneAll />
              {t("tasks.selfChecked.markCompleted")}
            </Button>
          </>
        )}

        {/*Progress bar*/}
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

      {/*Task selector*/}
      <motion.div
        className={styles.taskSelectorContainer}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 50 }}
      >
        <TaskSelector />
      </motion.div>
    </motion.div>
  );
});
